/*
  Warnings:

  - You are about to alter the column `productAlcohol` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `productApk` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `productPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `productVolume` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

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
    "productVolume" REAL NOT NULL,
    "productPrice" REAL NOT NULL,
    "productAlcohol" REAL NOT NULL,
    "productApk" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "id", "productAlcohol", "productApk", "productCategory", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt") SELECT "createdAt", "id", "productAlcohol", "productApk", "productCategory", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_productApk_idx" ON "Product"("productApk");
CREATE INDEX "Product_productPrice_idx" ON "Product"("productPrice");
CREATE INDEX "Product_productCategory_idx" ON "Product"("productCategory");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
