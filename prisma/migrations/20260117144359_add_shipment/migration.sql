-- CreateTable
CREATE TABLE `Shipment` (
    `id_shipment` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_company` VARCHAR(100) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `shipment_date` DATETIME(3) NULL,
    `estimated_delivery_date` DATETIME(3) NULL,
    `actual_delivery_date` DATETIME(3) NULL,
    `id_warehouse` INTEGER NOT NULL,

    PRIMARY KEY (`id_shipment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_id_warehouse_fkey` FOREIGN KEY (`id_warehouse`) REFERENCES `Warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;
