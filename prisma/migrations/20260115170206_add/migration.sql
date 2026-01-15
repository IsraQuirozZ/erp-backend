/*
  Warnings:

  - A unique constraint covering the columns `[id_address,name]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Warehouse_id_address_name_key` ON `Warehouse`(`id_address`, `name`);
