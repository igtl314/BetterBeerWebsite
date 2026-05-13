/*
  Warnings:

  - The primary key for the `StockInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StockInfo` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `StockInfo` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `StockInfo` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `StockInfo` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `StockInfo` table. All the data in the column will be lost.
  - Added the required column `ID` to the `StockInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Location` to the `StockInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductId` to the `StockInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Stock` to the `StockInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StoreId` to the `StockInfo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StockInfo" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "StoreId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "Location" TEXT NOT NULL,
    "Stock" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StockInfo_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StockInfo_StoreId_fkey" FOREIGN KEY ("StoreId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StockInfo" ("createdAt", "updatedAt") SELECT "createdAt", "updatedAt" FROM "StockInfo";
DROP TABLE "StockInfo";
ALTER TABLE "new_StockInfo" RENAME TO "StockInfo";
CREATE INDEX "StockInfo_ProductId_idx" ON "StockInfo"("ProductId");
CREATE INDEX "StockInfo_StoreId_idx" ON "StockInfo"("StoreId");
CREATE UNIQUE INDEX "StockInfo_StoreId_ProductId_key" ON "StockInfo"("StoreId", "ProductId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
