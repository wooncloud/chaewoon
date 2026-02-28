-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentKey" TEXT,
ADD COLUMN     "paymentMethod" TEXT;
