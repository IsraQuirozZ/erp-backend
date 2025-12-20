-- CreateTable
CREATE TABLE `CLIENTE` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `id_direccion` INTEGER NOT NULL,

    UNIQUE INDEX `CLIENTE_email_key`(`email`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CLIENTE` ADD CONSTRAINT `CLIENTE_id_direccion_fkey` FOREIGN KEY (`id_direccion`) REFERENCES `DIRECCION`(`id_direccion`) ON DELETE RESTRICT ON UPDATE CASCADE;
