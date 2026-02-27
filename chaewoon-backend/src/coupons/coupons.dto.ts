import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsEnum,
  Min,
} from "class-validator";

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsEnum(["PERCENT", "FIXED"])
  discountType: string;

  @IsInt()
  @Min(1)
  discountValue: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minOrderAmount?: number;

  @IsOptional()
  @IsInt()
  maxDiscountAmount?: number;

  @IsString()
  validFrom: string;

  @IsString()
  validUntil: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(["PERCENT", "FIXED"])
  discountType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  discountValue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minOrderAmount?: number;

  @IsOptional()
  @IsInt()
  maxDiscountAmount?: number;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsString()
  validUntil?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
