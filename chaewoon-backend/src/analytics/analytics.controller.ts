import { Controller, Get, Query } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("summary")
  getSummary() {
    return this.analyticsService.getSummary();
  }

  @Get("monthly-revenue")
  getMonthlyRevenue() {
    return this.analyticsService.getMonthlyRevenue();
  }

  @Get("order-status")
  getOrderStatusDistribution() {
    return this.analyticsService.getOrderStatusDistribution();
  }

  @Get("top-products")
  getTopProducts(@Query("limit") limit?: string) {
    return this.analyticsService.getTopProducts(
      limit ? parseInt(limit, 10) : 5,
    );
  }
}
