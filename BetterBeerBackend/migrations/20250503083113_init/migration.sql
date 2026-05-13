/*
  Warnings:

  - You are about to drop the column `productCategories` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productCategory` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productName" TEXT NOT NULL,
    "productNameThin" TEXT NOT NULL,
    "productCountry" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "productInfo" TEXT NOT NULL,
    "productImageURL" TEXT NOT NULL,
    "productVolume" INTEGER NOT NULL,
    "productPrice" TEXT NOT NULL,
    "productAlcohol" INTEGER NOT NULL,
    "productApk" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "id", "productAlcohol", "productApk", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt") SELECT "createdAt", "id", "productAlcohol", "productApk", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_productCountry_idx" ON "Product"("productCountry");
CREATE INDEX "Product_productAlcohol_idx" ON "Product"("productAlcohol");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
