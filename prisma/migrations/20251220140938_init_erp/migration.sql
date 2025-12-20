-- CreateTable
CREATE TABLE `PROVINCIA` (
    `id_provincia` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `PROVINCIA_nombre_key`(`nombre`),
    PRIMARY KEY (`id_provincia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DIRECCION` (
    `id_direccion` INTEGER NOT NULL AUTO_INCREMENT,
    `calle` VARCHAR(150) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,
    `portal` VARCHAR(10) NULL,
    `piso` VARCHAR(10) NULL,
    `puerta` VARCHAR(10) NULL,
    `municipio` VARCHAR(10) NOT NULL,
    `codigo_postal` VARCHAR(10) NOT NULL,
    `id_provincia` INTEGER NOT NULL,

    PRIMARY KEY (`id_direccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DIRECCION` ADD CONSTRAINT `DIRECCION_id_provincia_fkey` FOREIGN KEY (`id_provincia`) REFERENCES `PROVINCIA`(`id_provincia`) ON DELETE RESTRICT ON UPDATE CASCADE;
