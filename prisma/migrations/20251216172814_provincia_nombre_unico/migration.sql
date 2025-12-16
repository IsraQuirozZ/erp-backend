/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `PROVINCIA` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PROVINCIA_nombre_key` ON `PROVINCIA`(`nombre`);
