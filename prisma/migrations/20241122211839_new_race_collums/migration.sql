/*
  Warnings:

  - Added the required column `date` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driverId" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "Race_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Race_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Race" ("driverId", "id", "userID") SELECT "driverId", "id", "userID" FROM "Race";
DROP TABLE "Race";
ALTER TABLE "new_Race" RENAME TO "Race";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
