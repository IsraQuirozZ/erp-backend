-- CreateTable
CREATE TABLE `Warehouse` (
    `id_warehouse` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `warehouse_type` ENUM('MAIN', 'SECONDARY', 'DISTRIBUTION', 'STORE') NOT NULL DEFAULT 'MAIN',
    `capacity` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_address` INTEGER NOT NULL,

    PRIMARY KEY (`id_warehouse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;
