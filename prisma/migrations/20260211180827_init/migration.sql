/*
  Warnings:

  - Added the required column `id_warehouse` to the `SupplierOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SupplierOrder` ADD COLUMN `id_warehouse` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SupplierOrder` ADD CONSTRAINT `SupplierOrder_id_warehouse_fkey` FOREIGN KEY (`id_warehouse`) REFERENCES `Warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;
