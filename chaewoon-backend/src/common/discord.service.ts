import { Injectable, Logger } from "@nestjs/common";

interface DiscordEmbed {
  title: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  private async send(webhookUrl: string | undefined, embeds: DiscordEmbed[]) {
    if (!webhookUrl) return;

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds }),
      });
      if (!res.ok) {
        this.logger.warn(`Discord webhook failed: ${res.status}`);
      }
    } catch (err) {
      this.logger.warn(`Discord webhook error: ${err}`);
    }
  }

  async sendOrderNotification(order: {
    id: string;
    total: number;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingDetail: string;
    items: { product: { name: string } }[];
  }) {
    const productNames = order.items.map((i) => i.product.name).join(", ");
    const embed: DiscordEmbed = {
      title: "🛒 새 주문이 접수되었습니다",
      color: 0x6366f1, // indigo
      fields: [
        { name: "주문 번호", value: order.id, inline: true },
        {
          name: "결제 금액",
          value: `${order.total.toLocaleString()}원`,
          inline: true,
        },
        { name: "작품", value: productNames },
        { name: "수령인", value: order.shippingName, inline: true },
        { name: "연락처", value: order.shippingPhone, inline: true },
        {
          name: "배송지",
          value: `${order.shippingAddress} ${order.shippingDetail}`.trim(),
        },
      ],
      timestamp: new Date().toISOString(),
    };

    await this.send(process.env.DISCORD_ORDER_WEBHOOK_URL, [embed]);
  }

  async sendContactNotification(contact: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    const fields: { name: string; value: string; inline?: boolean }[] = [
      { name: "이름", value: contact.name, inline: true },
      { name: "이메일", value: contact.email, inline: true },
    ];
    if (contact.phone) {
      fields.push({ name: "전화번호", value: contact.phone, inline: true });
    }
    fields.push({ name: "문의 내용", value: contact.message });

    const embed: DiscordEmbed = {
      title: "💬 새 문의가 접수되었습니다",
      color: 0x10b981, // emerald
      fields,
      timestamp: new Date().toISOString(),
    };

    await this.send(process.env.DISCORD_CONTACT_WEBHOOK_URL, [embed]);
  }
}
