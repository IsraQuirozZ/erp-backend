-- CreateTable
CREATE TABLE `SupplierOrder` (
    `id_supplier_order` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `expected_delivery_date` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_supplier` INTEGER NOT NULL,

    PRIMARY KEY (`id_supplier_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierOrderItem` (
    `id_supplier_order_item` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `id_supplier_order` INTEGER NOT NULL,
    `id_supplier_product` INTEGER NOT NULL,

    UNIQUE INDEX `SupplierOrderItem_id_supplier_order_id_supplier_product_key`(`id_supplier_order`, `id_supplier_product`),
    PRIMARY KEY (`id_supplier_order_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SupplierOrder` ADD CONSTRAINT `SupplierOrder_id_supplier_fkey` FOREIGN KEY (`id_supplier`) REFERENCES `Supplier`(`id_supplier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierOrderItem` ADD CONSTRAINT `SupplierOrderItem_id_supplier_order_fkey` FOREIGN KEY (`id_supplier_order`) REFERENCES `SupplierOrder`(`id_supplier_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierOrderItem` ADD CONSTRAINT `SupplierOrderItem_id_supplier_product_fkey` FOREIGN KEY (`id_supplier_product`) REFERENCES `SUPPLIER_PRODUCT`(`id_supplier_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
