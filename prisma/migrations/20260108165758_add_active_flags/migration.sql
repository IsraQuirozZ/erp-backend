-- AlterTable
ALTER TABLE `Client` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Employee` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Supplier` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;
