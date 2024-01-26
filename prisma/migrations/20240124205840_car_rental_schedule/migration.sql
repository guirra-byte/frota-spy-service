-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_schedule_rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startAt" TEXT NOT NULL,
    "finishAt" TEXT NOT NULL,
    "nextCheck" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "roverPlate" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "outInfractionsLaunchDeadline" INTEGER NOT NULL DEFAULT 0,
    "lodgerId" TEXT NOT NULL,
    "shippingCarId" TEXT,
    CONSTRAINT "schedule_rental_lodgerId_fkey" FOREIGN KEY ("lodgerId") REFERENCES "Lodger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "schedule_rental_shippingCarId_fkey" FOREIGN KEY ("shippingCarId") REFERENCES "ShippingCar" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_schedule_rental" ("cost", "finishAt", "id", "lodgerId", "nextCheck", "outInfractionsLaunchDeadline", "roverPlate", "startAt", "status", "terms") SELECT "cost", "finishAt", "id", "lodgerId", "nextCheck", "outInfractionsLaunchDeadline", "roverPlate", "startAt", "status", "terms" FROM "schedule_rental";
DROP TABLE "schedule_rental";
ALTER TABLE "new_schedule_rental" RENAME TO "schedule_rental";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
