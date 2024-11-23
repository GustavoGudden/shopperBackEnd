/*
  Warnings:

  - You are about to alter the column `minKm` on the `Driver` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Driver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "car" TEXT NOT NULL,
    "avaliation" INTEGER NOT NULL,
    "tax" REAL NOT NULL,
    "minKm" INTEGER NOT NULL
);
INSERT INTO "new_Driver" ("avaliation", "car", "description", "id", "minKm", "name", "tax") SELECT "avaliation", "car", "description", "id", "minKm", "name", "tax" FROM "Driver";
DROP TABLE "Driver";
ALTER TABLE "new_Driver" RENAME TO "Driver";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
