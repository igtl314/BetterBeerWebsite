/*
  Warnings:

  - You are about to drop the column `productAlcohol` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productApk` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productCategory` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productCountry` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productImageURL` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productInfo` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productNameThin` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productVolume` on the `Product` table. All the data in the column will be lost.
  - Added the required column `ProductAlcohol` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductApk` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductCategory` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductCountry` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductImageURL` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductInfo` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductNameThin` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductVolume` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProductName" TEXT NOT NULL,
    "ProductNameThin" TEXT NOT NULL,
    "ProductCountry" TEXT NOT NULL,
    "ProductCategory" TEXT NOT NULL,
    "ProductInfo" TEXT NOT NULL,
    "ProductImageURL" TEXT NOT NULL,
    "ProductVolume" REAL NOT NULL,
    "ProductPrice" REAL NOT NULL,
    "ProductAlcohol" REAL NOT NULL,
    "ProductApk" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("ID", "createdAt", "updatedAt") SELECT "ID", "createdAt", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_ProductApk_idx" ON "Product"("ProductApk");
CREATE INDEX "Product_ProductPrice_idx" ON "Product"("ProductPrice");
CREATE INDEX "Product_ProductCategory_idx" ON "Product"("ProductCategory");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
