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
    `municipality` VARCHAR(150) NOT NULL,
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
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_address` INTEGER NOT NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id_supplier` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
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

-- CreateTable
CREATE TABLE `Employee` (
    `id_employee` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `job_title` VARCHAR(100) NOT NULL,
    `hire_date` DATETIME(3) NOT NULL,
    `base_salary` DECIMAL(10, 2) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_address` INTEGER NOT NULL,
    `id_department` INTEGER NOT NULL,

    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id_employee`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payroll` (
    `id_payroll` INTEGER NOT NULL AUTO_INCREMENT,
    `period` VARCHAR(7) NOT NULL,
    `base_salary` DECIMAL(10, 2) NOT NULL,
    `overtime_hours` DECIMAL(6, 2) NULL,
    `deductions` DECIMAL(10, 2) NOT NULL,
    `taxes` DECIMAL(10, 2) NOT NULL,
    `net_salary` DECIMAL(10, 2) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `id_employee` INTEGER NOT NULL,

    PRIMARY KEY (`id_payroll`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SUPPLIER_PRODUCT` (
    `id_supplier_product` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `purchase_price` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(250) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_supplier` INTEGER NOT NULL,

    UNIQUE INDEX `SUPPLIER_PRODUCT_id_supplier_name_key`(`id_supplier`, `name`),
    PRIMARY KEY (`id_supplier_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Product` (
    `id_product` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(250) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_supplier_product` INTEGER NOT NULL,

    UNIQUE INDEX `Product_name_id_supplier_product_key`(`name`, `id_supplier_product`),
    PRIMARY KEY (`id_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `id_warehouse` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `warehouse_type` ENUM('MAIN', 'SECONDARY', 'DISTRIBUTION', 'STORE') NOT NULL DEFAULT 'MAIN',
    `capacity` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_address` INTEGER NOT NULL,

    UNIQUE INDEX `Warehouse_id_address_name_key`(`id_address`, `name`),
    PRIMARY KEY (`id_warehouse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierProductInventory` (
    `current_stock` INTEGER NOT NULL,
    `max_stock` INTEGER NOT NULL,
    `min_stock` INTEGER NOT NULL,
    `last_updated` DATETIME(3) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `id_supplier_product` INTEGER NOT NULL,
    `id_warehouse` INTEGER NOT NULL,

    PRIMARY KEY (`id_supplier_product`, `id_warehouse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `id_client_order` INTEGER NOT NULL,
    `id_product` INTEGER NOT NULL,

    PRIMARY KEY (`id_client_order`, `id_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_id_province_fkey` FOREIGN KEY (`id_province`) REFERENCES `Province`(`id_province`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_department_fkey` FOREIGN KEY (`id_department`) REFERENCES `Department`(`id_department`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_id_employee_fkey` FOREIGN KEY (`id_employee`) REFERENCES `Employee`(`id_employee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SUPPLIER_PRODUCT` ADD CONSTRAINT `SUPPLIER_PRODUCT_id_supplier_fkey` FOREIGN KEY (`id_supplier`) REFERENCES `Supplier`(`id_supplier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierOrder` ADD CONSTRAINT `SupplierOrder_id_supplier_fkey` FOREIGN KEY (`id_supplier`) REFERENCES `Supplier`(`id_supplier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierOrderItem` ADD CONSTRAINT `SupplierOrderItem_id_supplier_order_fkey` FOREIGN KEY (`id_supplier_order`) REFERENCES `SupplierOrder`(`id_supplier_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierOrderItem` ADD CONSTRAINT `SupplierOrderItem_id_supplier_product_fkey` FOREIGN KEY (`id_supplier_product`) REFERENCES `SUPPLIER_PRODUCT`(`id_supplier_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_id_supplier_product_fkey` FOREIGN KEY (`id_supplier_product`) REFERENCES `SUPPLIER_PRODUCT`(`id_supplier_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierProductInventory` ADD CONSTRAINT `SupplierProductInventory_id_supplier_product_fkey` FOREIGN KEY (`id_supplier_product`) REFERENCES `SUPPLIER_PRODUCT`(`id_supplier_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierProductInventory` ADD CONSTRAINT `SupplierProductInventory_id_warehouse_fkey` FOREIGN KEY (`id_warehouse`) REFERENCES `Warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductInventory` ADD CONSTRAINT `ProductInventory_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductInventory` ADD CONSTRAINT `ProductInventory_id_warehouse_fkey` FOREIGN KEY (`id_warehouse`) REFERENCES `Warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_id_warehouse_fkey` FOREIGN KEY (`id_warehouse`) REFERENCES `Warehouse`(`id_warehouse`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOrder` ADD CONSTRAINT `ClientOrder_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOrder` ADD CONSTRAINT `ClientOrder_id_shipment_fkey` FOREIGN KEY (`id_shipment`) REFERENCES `Shipment`(`id_shipment`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOrderItem` ADD CONSTRAINT `ClientOrderItem_id_client_order_fkey` FOREIGN KEY (`id_client_order`) REFERENCES `ClientOrder`(`id_client_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOrderItem` ADD CONSTRAINT `ClientOrderItem_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
