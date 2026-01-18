-- CreateTable
CREATE TABLE `ClientOrder` (
    `id_client_order` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `expected_delivery_date` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `id_client` INTEGER NOT NULL,
    `id_shipment` INTEGER NULL,

    PRIMARY KEY (`id_client_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientOrderItem` (
    `id_client_order_item` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `id_client_order` INTEGER NOT NULL,
    `id_product` INTEGER NOT NULL,

    UNIQUE INDEX `ClientOrderItem_id_client_order_id_product_key`(`id_client_order`, `id_product`),
    PRIMARY KEY (`id_client_order_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClientOrder` ADD CONSTRAINT `ClientOrder_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOrder` ADD CONSTRAINT `ClientOrder_id_shipment_fkey` FOREIGN KEY (`id_shipment`) REFERENCES `Shipment`(`id_shipment`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOrderItem` ADD CONSTRAINT `ClientOrderItem_id_client_order_fkey` FOREIGN KEY (`id_client_order`) REFERENCES `ClientOrder`(`id_client_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOrderItem` ADD CONSTRAINT `ClientOrderItem_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
