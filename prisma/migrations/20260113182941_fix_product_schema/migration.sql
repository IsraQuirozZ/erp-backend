/*
  Warnings:

  - You are about to drop the column `id_supplier` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,id_supplier_product]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_supplier_product` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_id_supplier_fkey`;

-- DropIndex
DROP INDEX `Product_id_supplier_fkey` ON `Product`;

-- DropIndex
DROP INDEX `Product_name_id_supplier_key` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `id_supplier`,
    ADD COLUMN `id_supplier_product` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_name_id_supplier_product_key` ON `Product`(`name`, `id_supplier_product`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_id_supplier_product_fkey` FOREIGN KEY (`id_supplier_product`) REFERENCES `SUPPLIER_PRODUCT`(`id_supplier_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
