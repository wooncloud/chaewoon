import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto, UpdateCouponDto } from "./coupons.dto";

@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Get("validate")
  validate(@Query("code") code: string, @Query("amount") amount: string) {
    return this.couponsService.validate(code, parseInt(amount, 10));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.couponsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.couponsService.remove(id);
  }

  @Patch(":id/toggle-active")
  toggleActive(@Param("id") id: string) {
    return this.couponsService.toggleActive(id);
  }
}
