-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_productId_fkey";

-- CreateTable
CREATE TABLE "productCoupons" (
    "productId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "productCoupons_productId_couponId_key" ON "productCoupons"("productId", "couponId");

-- AddForeignKey
ALTER TABLE "productCoupons" ADD CONSTRAINT "productCoupons_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productCoupons" ADD CONSTRAINT "productCoupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
