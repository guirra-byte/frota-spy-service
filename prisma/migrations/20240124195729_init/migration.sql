-- CreateTable
CREATE TABLE "Infraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lawCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notice" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "localization" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "roverPlate" TEXT NOT NULL,
    CONSTRAINT "Infraction_roverPlate_fkey" FOREIGN KEY ("roverPlate") REFERENCES "ShippingCar" ("plate") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lodger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "paymentInfos" TEXT NOT NULL,
    "shippingCarId" TEXT,
    CONSTRAINT "Lodger_shippingCarId_fkey" FOREIGN KEY ("shippingCarId") REFERENCES "ShippingCar" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShippingCar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "schedule_rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishAt" DATETIME NOT NULL,
    "terms" TEXT NOT NULL,
    "roverPlate" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "outInfractionsLaunchDeadline" BOOLEAN NOT NULL DEFAULT false,
    "lodgerId" TEXT NOT NULL,
    CONSTRAINT "schedule_rental_lodgerId_fkey" FOREIGN KEY ("lodgerId") REFERENCES "Lodger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Lodger_name_key" ON "Lodger"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lodger_email_key" ON "Lodger"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lodger_cpf_key" ON "Lodger"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingCar_plate_key" ON "ShippingCar"("plate");
