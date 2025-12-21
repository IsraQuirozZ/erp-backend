-- CreateTable
CREATE TABLE `Province` (
    `id_province` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Province_name_key`(`name`),
    PRIMARY KEY (`id_province`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id_address` INTEGER NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(150) NOT NULL,
    `number` VARCHAR(10) NOT NULL,
    `portal` VARCHAR(10) NULL,
    `floor` VARCHAR(10) NULL,
    `door` VARCHAR(10) NULL,
    `city` VARCHAR(150) NOT NULL,
    `postal_code` VARCHAR(10) NOT NULL,
    `id_province` INTEGER NOT NULL,

    PRIMARY KEY (`id_address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id_client` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `id_address` INTEGER NOT NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SUPPLIER` (
    `id_supplier` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `id_address` INTEGER NOT NULL,

    UNIQUE INDEX `SUPPLIER_email_key`(`email`),
    PRIMARY KEY (`id_supplier`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_id_province_fkey` FOREIGN KEY (`id_province`) REFERENCES `Province`(`id_province`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SUPPLIER` ADD CONSTRAINT `SUPPLIER_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;
