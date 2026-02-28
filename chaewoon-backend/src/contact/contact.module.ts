import { Module } from "@nestjs/common";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { DiscordService } from "../common/discord.service";

@Module({
  controllers: [ContactController],
  providers: [ContactService, DiscordService],
})
export class ContactModule {}
