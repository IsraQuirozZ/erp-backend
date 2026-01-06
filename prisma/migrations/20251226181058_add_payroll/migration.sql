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

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_id_employee_fkey` FOREIGN KEY (`id_employee`) REFERENCES `Employee`(`id_employee`) ON DELETE RESTRICT ON UPDATE CASCADE;
