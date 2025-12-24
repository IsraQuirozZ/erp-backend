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
    `id_address` INTEGER NOT NULL,
    `id_department` INTEGER NOT NULL,

    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id_employee`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_department_fkey` FOREIGN KEY (`id_department`) REFERENCES `Department`(`id_department`) ON DELETE RESTRICT ON UPDATE CASCADE;
