/*
  Warnings:

  - You are about to drop the column `address` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Store` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Store" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE INDEX "Store_name_idx" ON "Store"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
