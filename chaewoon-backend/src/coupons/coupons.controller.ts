import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto, UpdateCouponDto } from "./coupons.dto";
import { AdminGuard } from "../auth/auth.guard";

@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.couponsService.findAll();
  }

  @Get("validate")
  validate(@Query("code") code: string, @Query("amount") amount: string) {
    return this.couponsService.validate(code, parseInt(amount, 10));
  }

  @Get(":id")
  @UseGuards(AdminGuard)
  findOne(@Param("id") id: string) {
    return this.couponsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  update(@Param("id") id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  remove(@Param("id") id: string) {
    return this.couponsService.remove(id);
  }

  @Patch(":id/toggle-active")
  @UseGuards(AdminGuard)
  toggleActive(@Param("id") id: string) {
    return this.couponsService.toggleActive(id);
  }
}
