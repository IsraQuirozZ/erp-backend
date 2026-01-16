const prisma = require("../config/prisma");

const getAllInventories = async () => {
  return await prisma.supplierProductInventory.findMany({
    where: { active: true },
    include: { supplierProduct: true, warehouse: true },
  });
};

// PK composed of id_supplier_product && id_warehouse
const getInventory = async (id_supplier_product, id_warehouse) => {
  const inventory = await prisma.supplierProductInventory.findUnique({
    where: {
      id_supplier_product_id_warehouse: { id_supplier_product, id_warehouse },
    },
    include: { supplierProduct: true, warehouse: true },
  });

  if (!inventory) {
    throw {
      status: 404,
      message: "Supplier Product Inventory not found",
    };
  }

  return inventory;
};

const createSupplierProductInventory = async (data) => {
  try {
    const supplierProduct = await prisma.supplierProduct.findUnique({
      where: {
        id_supplier_product: data.id_supplier_product,
      },
    });

    if (!supplierProduct || !supplierProduct.active) {
      throw {
        status: 400,
        message: "Supplier Product not found",
      };
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: { id_warehouse: data.id_warehouse },
    });

    if (!warehouse || !warehouse.active) {
      throw {
        status: 400,
        message: "Warehouse not found",
      };
    }

    return await prisma.supplierProductInventory.create({
      data,
      include: {
        supplierProduct: true,
        warehouse: true,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message:
          "The inventory with this product and this warehouse already exists",
      };
    }
    throw error;
  }
};

module.exports = {
  getAllInventories,
  getInventory,
  createSupplierProductInventory,
};
