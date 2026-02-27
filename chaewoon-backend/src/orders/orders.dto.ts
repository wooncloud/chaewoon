import { IsString, IsInt, IsOptional, IsEnum, Min } from "class-validator";

export class CreateOrderDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(0)
  subtotal: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  couponDiscount?: number;

  @IsInt()
  @Min(0)
  total: number;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsString()
  shippingName: string;

  @IsString()
  shippingPhone: string;

  @IsString()
  shippingZipCode: string;

  @IsString()
  shippingAddress: string;

  @IsOptional()
  @IsString()
  shippingDetail?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"])
  status: string;
}
