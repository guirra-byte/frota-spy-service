/*
  Warnings:

  - Added the required column `nextCheck` to the `schedule_rental` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_schedule_rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishAt" DATETIME NOT NULL,
    "nextCheck" DATETIME NOT NULL,
    "terms" TEXT NOT NULL,
    "roverPlate" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "outInfractionsLaunchDeadline" BOOLEAN NOT NULL DEFAULT false,
    "lodgerId" TEXT NOT NULL,
    CONSTRAINT "schedule_rental_lodgerId_fkey" FOREIGN KEY ("lodgerId") REFERENCES "Lodger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_schedule_rental" ("cost", "finishAt", "id", "lodgerId", "outInfractionsLaunchDeadline", "roverPlate", "startAt", "status", "terms") SELECT "cost", "finishAt", "id", "lodgerId", "outInfractionsLaunchDeadline", "roverPlate", "startAt", "status", "terms" FROM "schedule_rental";
DROP TABLE "schedule_rental";
ALTER TABLE "new_schedule_rental" RENAME TO "schedule_rental";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
