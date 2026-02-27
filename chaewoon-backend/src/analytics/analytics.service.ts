import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const orders = await this.prisma.order.findMany({
      where: { status: { not: "CANCELLED" } },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderAmount =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const totalSold = await this.prisma.product.count({
      where: { sold: true },
    });
    const totalAvailable = await this.prisma.product.count({
      where: { sold: false, published: true },
    });
    const totalProducts = await this.prisma.product.count();
    const totalCoupons = await this.prisma.coupon.count();

    return {
      totalRevenue,
      totalOrders,
      avgOrderAmount,
      totalSold,
      totalAvailable,
      totalProducts,
      totalCoupons,
    };
  }

  async getMonthlyRevenue() {
    const orders = await this.prisma.order.findMany({
      where: { status: { not: "CANCELLED" } },
      orderBy: { createdAt: "asc" },
    });

    const monthMap = new Map<string, number>();
    for (const order of orders) {
      const key = order.createdAt.toISOString().slice(0, 7);
      monthMap.set(key, (monthMap.get(key) ?? 0) + order.total);
    }

    return Array.from(monthMap.entries()).map(([key, revenue]) => ({
      key,
      label: `${parseInt(key.slice(5))}월`,
      revenue,
    }));
  }

  async getOrderStatusDistribution() {
    const statuses = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"] as const;
    const result = [];

    for (const status of statuses) {
      const count = await this.prisma.order.count({ where: { status } });
      result.push({ status: status.toLowerCase(), count });
    }

    return result;
  }

  async getTopProducts(limit = 5) {
    const items = await this.prisma.orderItem.groupBy({
      by: ["productId"],
      _count: { id: true },
      _sum: { quantity: true },
      orderBy: { _count: { id: "desc" } },
      take: limit,
    });

    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    return items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        product,
        orderCount: item._count.id,
        totalQuantity: item._sum.quantity ?? 0,
      };
    });
  }
}
