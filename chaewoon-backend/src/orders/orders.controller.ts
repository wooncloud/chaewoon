import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./orders.dto";
import { AdminGuard } from "../auth/auth.guard";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query("status") status?: string) {
    return this.ordersService.findAll(status);
  }

  @Get(":id")
  @UseGuards(AdminGuard)
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get(":id/summary")
  findSummary(@Param("id") id: string) {
    return this.ordersService.findSummary(id);
  }

  @Post(":id/cancel")
  cancel(@Param("id") id: string) {
    return this.ordersService.cancel(id);
  }

  @Patch(":id/status")
  @UseGuards(AdminGuard)
  updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
