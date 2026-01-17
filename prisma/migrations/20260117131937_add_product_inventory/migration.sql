-- CreateTable
CREATE TABLE `ProductInventory` (
    `current_stock` INTEGER NOT NULL,
    `max_stock` INTEGER NOT NULL,
    `min_stock` INTEGER NOT NULL,
    `last_updated` DATETIME(3) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_product` INTEGER NOT NULL,
    `id_warehouse` INTEGER NOT NULL,

    PRIMARY KEY (`id_product`, `id_warehouse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductInventory` ADD CONSTRAINT `ProductInventory_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductInventory` ADD CONSTRAINT `ProductInventory_id_warehouse_fkey` FOREIGN KEY (`id_warehouse`) REFERENCES `Warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;
