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

const updateInventory = async (id_supplier_product, id_warehouse, data) => {
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

  if (!inventory.active && data.active !== true) {
    throw {
      status: 400,
      message: "Inactive Supplier Product Inventory can only be reactivated",
    };
  }

  // If reactivated -> Reset Stock
  const isReactivating = inventory.active === false && data.active === true;

  if (isReactivating) {
    data.current_stock = 0;
  }

  // NEW VALUES
  const newMax =
    data.max_stock !== undefined ? data.max_stock : inventory.max_stock;

  const newMin =
    data.min_stock !== undefined ? data.min_stock : inventory.min_stock;

  if (newMin > newMax) {
    throw {
      status: 400,
      message: "Min stock cannot be greater than max stock",
    };
  }

  const finalStock = isReactivating ? 0 : inventory.current_stock;

  if (finalStock < newMin || finalStock > newMax) {
    throw {
      status: 400,
      message: "Current Stock must be between min and max stock",
    };
  }

  // TODO: if reactivated -> current_stock = 0
  return await prisma.supplierProductInventory.update({
    where: {
      id_supplier_product_id_warehouse: { id_supplier_product, id_warehouse },
    },
    data,
    include: { supplierProduct: true, warehouse: true },
  });
};

// TODO: If it has supplierOrders "PENDING" or "CONFIRMED" -> Don't delete
const deleteInventory = async (id_supplier_product, id_warehouse) => {
  const inventory = await prisma.supplierProductInventory.findUnique({
    where: {
      id_supplier_product_id_warehouse: { id_supplier_product, id_warehouse },
    },
  });

  if (!inventory) {
    throw {
      status: 404,
      message: "Supplier Product Inventory not found",
    };
  }

  if (!inventory.active) {
    throw {
      status: 400,
      message: "Supplier Product Inventory is already inactive",
    };
  }

  if (inventory.current_stock !== 0) {
    throw {
      status: 400,
      message: "Inventory cannot be deleted because it has stock",
    };
  }
};

module.exports = {
  getAllInventories,
  getInventory,
  createSupplierProductInventory,
  updateInventory,
  deleteInventory,
};
