import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCouponDto, UpdateCouponDto } from "./coupons.dto";

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException("쿠폰을 찾을 수 없습니다.");
    return coupon;
  }

  async create(dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        code: dto.code,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        minOrderAmount: dto.minOrderAmount ?? 0,
        maxDiscountAmount: dto.maxDiscountAmount,
        validFrom: new Date(dto.validFrom),
        validUntil: new Date(dto.validUntil),
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.discountType) data.discountType = dto.discountType;
    if (dto.validFrom) data.validFrom = new Date(dto.validFrom);
    if (dto.validUntil) data.validUntil = new Date(dto.validUntil);
    return this.prisma.coupon.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coupon.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const coupon = await this.findOne(id);
    return this.prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });
  }

  async validate(code: string, amount: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

    if (!coupon) {
      throw new BadRequestException("존재하지 않는 쿠폰입니다.");
    }
    if (!coupon.isActive) {
      throw new BadRequestException("비활성화된 쿠폰입니다.");
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException("유효 기간이 아닌 쿠폰입니다.");
    }
    if (amount < coupon.minOrderAmount) {
      throw new BadRequestException(
        `최소 주문 금액 ${coupon.minOrderAmount}원 이상이어야 합니다.`,
      );
    }

    let discount =
      coupon.discountType === "PERCENT"
        ? Math.floor(amount * (coupon.discountValue / 100))
        : coupon.discountValue;

    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    return {
      valid: true,
      coupon,
      discount,
      finalAmount: amount - discount,
    };
  }
}
