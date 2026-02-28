import { Controller, Post, Body, Param, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { AdminGuard } from "../auth/auth.guard";
import { ConfirmPaymentDto } from "./payments.dto";

@Controller("payments")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("confirm")
  confirm(@Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirm(dto);
  }

  @Post(":id/refund")
  @UseGuards(AdminGuard)
  refund(@Param("id") id: string) {
    return this.paymentsService.refund(id);
  }
}
