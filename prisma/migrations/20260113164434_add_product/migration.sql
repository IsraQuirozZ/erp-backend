-- CreateTable
CREATE TABLE `Product` (
    `id_product` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(250) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_supplier` INTEGER NOT NULL,

    PRIMARY KEY (`id_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_id_supplier_fkey` FOREIGN KEY (`id_supplier`) REFERENCES `Supplier`(`id_supplier`) ON DELETE RESTRICT ON UPDATE CASCADE;
