/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `ID` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
INSERT INTO "new_Product" ("createdAt", "productAlcohol", "productApk", "productCategory", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt") SELECT "createdAt", "productAlcohol", "productApk", "productCategory", "productCountry", "productImageURL", "productInfo", "productName", "productNameThin", "productPrice", "productVolume", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_productApk_idx" ON "Product"("productApk");
CREATE INDEX "Product_productPrice_idx" ON "Product"("productPrice");
CREATE INDEX "Product_productCategory_idx" ON "Product"("productCategory");
CREATE TABLE "new_StockInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StockInfo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StockInfo_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StockInfo" ("createdAt", "id", "location", "productId", "stock", "storeId", "updatedAt") SELECT "createdAt", "id", "location", "productId", "stock", "storeId", "updatedAt" FROM "StockInfo";
DROP TABLE "StockInfo";
ALTER TABLE "new_StockInfo" RENAME TO "StockInfo";
CREATE INDEX "StockInfo_productId_idx" ON "StockInfo"("productId");
CREATE INDEX "StockInfo_storeId_idx" ON "StockInfo"("storeId");
CREATE UNIQUE INDEX "StockInfo_storeId_productId_key" ON "StockInfo"("storeId", "productId");
CREATE TABLE "new__ProductToStore" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProductToStore_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductToStore_B_fkey" FOREIGN KEY ("B") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__ProductToStore" ("A", "B") SELECT "A", "B" FROM "_ProductToStore";
DROP TABLE "_ProductToStore";
ALTER TABLE "new__ProductToStore" RENAME TO "_ProductToStore";
CREATE UNIQUE INDEX "_ProductToStore_AB_unique" ON "_ProductToStore"("A", "B");
CREATE INDEX "_ProductToStore_B_index" ON "_ProductToStore"("B");
CREATE TABLE "new__UserFavorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__UserFavorites" ("A", "B") SELECT "A", "B" FROM "_UserFavorites";
DROP TABLE "_UserFavorites";
ALTER TABLE "new__UserFavorites" RENAME TO "_UserFavorites";
CREATE UNIQUE INDEX "_UserFavorites_AB_unique" ON "_UserFavorites"("A", "B");
CREATE INDEX "_UserFavorites_B_index" ON "_UserFavorites"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
