import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DiscordService } from "../common/discord.service";
import { ConfirmPaymentDto } from "./payments.dto";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private discord: DiscordService,
  ) {}

  private getSecretKey(): string {
    const key = process.env.TOSS_SECRET_KEY;
    if (!key) {
      throw new InternalServerErrorException(
        "결제 서비스가 설정되지 않았습니다.",
      );
    }
    return key;
  }

  async confirm(dto: ConfirmPaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException("주문을 찾을 수 없습니다.");
    }

    // 멱등 처리: 이미 결제 완료된 주문
    if (order.status === "CONFIRMED" && order.paymentKey === dto.paymentKey) {
      return order;
    }

    if (order.status !== "PENDING") {
      throw new BadRequestException("결제 대기 상태의 주문이 아닙니다.");
    }

    if (dto.amount !== order.total) {
      throw new BadRequestException("결제 금액이 일치하지 않습니다.");
    }

    const secretKey = this.getSecretKey();
    const encodedKey = Buffer.from(`${secretKey}:`).toString("base64");

    const tossRes = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey: dto.paymentKey,
          orderId: dto.orderId,
          amount: dto.amount,
        }),
      },
    );

    if (!tossRes.ok) {
      const errorBody = await tossRes.json().catch(() => ({}));
      this.logger.error(`Toss confirm failed: ${JSON.stringify(errorBody)}`);
      throw new BadRequestException(
        errorBody.message || "결제 승인에 실패했습니다.",
      );
    }

    const tossData = await tossRes.json();

    const updated = await this.prisma.order.update({
      where: { id: dto.orderId },
      data: {
        paymentKey: dto.paymentKey,
        paymentMethod: tossData.method || null,
        paidAt: new Date(),
        status: "CONFIRMED",
      },
      include: { items: { include: { product: true } } },
    });

    this.discord.sendOrderNotification(updated).catch(() => {});

    return updated;
  }

  async refund(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException("주문을 찾을 수 없습니다.");
    }

    if (!order.paymentKey) {
      throw new BadRequestException(
        "결제 정보가 없는 주문입니다. 주문 취소를 이용해주세요.",
      );
    }

    if (order.status === "CANCELLED") {
      throw new BadRequestException("이미 취소된 주문입니다.");
    }

    const secretKey = this.getSecretKey();
    const encodedKey = Buffer.from(`${secretKey}:`).toString("base64");

    const tossRes = await fetch(
      `https://api.tosspayments.com/v1/payments/${order.paymentKey}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancelReason: "관리자 환불" }),
      },
    );

    if (!tossRes.ok) {
      const errorBody = await tossRes.json().catch(() => ({}));
      this.logger.error(`Toss refund failed: ${JSON.stringify(errorBody)}`);
      throw new BadRequestException(
        errorBody.message || "환불 처리에 실패했습니다.",
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
        include: { items: { include: { product: true } } },
      });

      for (const item of updated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { sold: false },
        });
      }

      return updated;
    });
  }
}
