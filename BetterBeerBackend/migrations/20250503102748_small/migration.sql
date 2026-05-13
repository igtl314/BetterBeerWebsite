-- DropIndex
DROP INDEX "Product_productAlcohol_idx";

-- DropIndex
DROP INDEX "Product_productCountry_idx";

-- CreateIndex
CREATE INDEX "Product_productApk_idx" ON "Product"("productApk");

-- CreateIndex
CREATE INDEX "Product_productPrice_idx" ON "Product"("productPrice");

-- CreateIndex
CREATE INDEX "Product_productCategory_idx" ON "Product"("productCategory");
