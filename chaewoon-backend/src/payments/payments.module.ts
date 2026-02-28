import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { DiscordService } from "../common/discord.service";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, DiscordService],
})
export class PaymentsModule {}
