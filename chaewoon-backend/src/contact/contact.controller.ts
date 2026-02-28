import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { DiscordService } from "../common/discord.service";
import { ContactService } from "./contact.service";
import { AdminGuard } from "../auth/auth.guard";
import { CreateContactDto } from "./contact.dto";

@Controller("contact")
export class ContactController {
  constructor(
    private contactService: ContactService,
    private discord: DiscordService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async create(@Body() dto: CreateContactDto) {
    const contact = await this.contactService.create(dto);

    // 디스코드 알림 (fire-and-forget)
    this.discord.sendContactNotification(dto).catch(() => {});

    return { success: true, id: contact.id };
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll() {
    return this.contactService.findAll();
  }
}
