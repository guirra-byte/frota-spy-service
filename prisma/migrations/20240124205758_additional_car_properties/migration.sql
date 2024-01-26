/*
  Warnings:

  - Added the required column `inOperationSince` to the `ShippingCar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ShippingCar` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShippingCar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "inOperationSince" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_ShippingCar" ("description", "id", "plate", "tags") SELECT "description", "id", "plate", "tags" FROM "ShippingCar";
DROP TABLE "ShippingCar";
ALTER TABLE "new_ShippingCar" RENAME TO "ShippingCar";
CREATE UNIQUE INDEX "ShippingCar_plate_key" ON "ShippingCar"("plate");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
