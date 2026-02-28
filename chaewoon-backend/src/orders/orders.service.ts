import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { OrderStatus } from "chaewoon-shared";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./orders.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status
      ? { status: status.toUpperCase() as OrderStatus }
      : {};

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    if (!order) throw new NotFoundException("주문을 찾을 수 없습니다.");
    return order;
  }

  async create(dto: CreateOrderDto) {
    // Transaction: check product not sold, create order, mark as sold
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: dto.productId },
      });

      if (!product) {
        throw new NotFoundException("작품을 찾을 수 없습니다.");
      }
      if (product.sold) {
        throw new BadRequestException("이미 판매 완료된 작품입니다.");
      }

      const order = await tx.order.create({
        data: {
          subtotal: dto.subtotal,
          couponDiscount: dto.couponDiscount ?? 0,
          total: dto.total,
          couponCode: dto.couponCode,
          shippingName: dto.shippingName,
          shippingPhone: dto.shippingPhone,
          shippingZipCode: dto.shippingZipCode,
          shippingAddress: dto.shippingAddress,
          shippingDetail: dto.shippingDetail ?? "",
          items: {
            create: {
              productId: dto.productId,
              quantity: 1,
            },
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      await tx.product.update({
        where: { id: dto.productId },
        data: { sold: true },
      });

      return order;
    });
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }
}
