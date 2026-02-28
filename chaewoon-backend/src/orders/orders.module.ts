import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { DiscordService } from "../common/discord.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, DiscordService],
})
export class OrdersModule {}
