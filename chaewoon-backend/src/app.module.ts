import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";
import { CouponsModule } from "./coupons/coupons.module";
import { AnalyticsModule } from "./analytics/analytics.module";

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    OrdersModule,
    CouponsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
