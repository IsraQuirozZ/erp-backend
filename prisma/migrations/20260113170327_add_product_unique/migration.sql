/*
  Warnings:

  - A unique constraint covering the columns `[name,id_supplier]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Product_name_id_supplier_key` ON `Product`(`name`, `id_supplier`);
