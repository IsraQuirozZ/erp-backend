/*
  Warnings:

  - You are about to drop the `Supplier_Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Supplier_Product` DROP FOREIGN KEY `Supplier_Product_id_supplier_fkey`;

-- DropTable
DROP TABLE `Supplier_Product`;

-- CreateTable
CREATE TABLE `SUPPLIER_PRODUCT` (
    `id_supplier_product` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `purchase_price` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(250) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_supplier` INTEGER NOT NULL,

    UNIQUE INDEX `SUPPLIER_PRODUCT_id_supplier_name_key`(`id_supplier`, `name`),
    PRIMARY KEY (`id_supplier_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SUPPLIER_PRODUCT` ADD CONSTRAINT `SUPPLIER_PRODUCT_id_supplier_fkey` FOREIGN KEY (`id_supplier`) REFERENCES `Supplier`(`id_supplier`) ON DELETE RESTRICT ON UPDATE CASCADE;
