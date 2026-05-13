/*
  Warnings:

  - You are about to alter the column `productPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

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
    "productPrice" INTEGER NOT NULL,
    "productAlcohol" INTEGER NOT NULL,
    "productApk" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "id", "productAlcohol", "productApk", "productCategory", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt") SELECT "createdAt", "id", "productAlcohol", "productApk", "productCategory", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_productCountry_idx" ON "Product"("productCountry");
CREATE INDEX "Product_productAlcohol_idx" ON "Product"("productAlcohol");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
