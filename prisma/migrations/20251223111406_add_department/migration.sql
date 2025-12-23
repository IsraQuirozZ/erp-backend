/*
  Warnings:

  - You are about to drop the `SUPPLIER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SUPPLIER` DROP FOREIGN KEY `SUPPLIER_id_address_fkey`;

-- DropTable
DROP TABLE `SUPPLIER`;

-- CreateTable
CREATE TABLE `Supplier` (
    `id_supplier` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `id_address` INTEGER NOT NULL,

    UNIQUE INDEX `Supplier_email_key`(`email`),
    PRIMARY KEY (`id_supplier`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id_department` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `desc` VARCHAR(250) NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`id_department`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;
