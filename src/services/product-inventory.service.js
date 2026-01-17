const prisma = require("../config/prisma");

const getAllInventories = async () => {
  return await prisma.productInventory.findMany({
    where: { active: true },
    include: { product: true, warehouse: true },
  });
};

// PK composed of id_product && id_warehouse
const getInventory = async (id_product, id_warehouse) => {
  const inventory = await prisma.productInventory.findUnique({
    where: {
      id_product_id_warehouse: { id_product, id_warehouse },
    },
    include: { product: true, warehouse: true },
  });

  if (!inventory) {
    throw {
      status: 404,
      message: "Product Inventory not found",
    };
  }

  return inventory;
};

const createInventory = async (data) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id_product: data.id_product,
      },
    });

    if (!product || !product.active) {
      throw {
        status: 400,
        message: "Product not found or inactive",
      };
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: { id_warehouse: data.id_warehouse },
    });

    if (!warehouse || !warehouse.active) {
      throw {
        status: 400,
        message: "Warehouse not found or inactive",
      };
    }

    return await prisma.productInventory.create({
      data,
      include: {
        product: true,
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

const updateInventory = async (id_product, id_warehouse, data) => {
  const inventory = await prisma.productInventory.findUnique({
    where: {
      id_product_id_warehouse: { id_product, id_warehouse },
    },
    include: { product: true, warehouse: true },
  });

  if (!inventory) {
    throw {
      status: 404,
      message: "Product Inventory not found",
    };
  }

  if (!inventory.active && data.active !== true) {
    throw {
      status: 400,
      message: "Inactive Product Inventory can only be reactivated",
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
  return await prisma.productInventory.update({
    where: {
      id_product_id_warehouse: { id_product, id_warehouse },
    },
    data,
    include: { product: true, warehouse: true },
  });
};

// TODO: If it has supplierOrders "PENDING" or "CONFIRMED" -> Don't delete
const deleteInventory = async (id_product, id_warehouse) => {
  const inventory = await prisma.productInventory.findUnique({
    where: {
      id_product_id_warehouse: { id_product, id_warehouse },
    },
  });

  if (!inventory) {
    throw {
      status: 404,
      message: "Product Inventory not found",
    };
  }

  if (!inventory.active) {
    throw {
      status: 400,
      message: "Product Inventory is already inactive",
    };
  }

  if (inventory.current_stock !== 0) {
    throw {
      status: 400,
      message: "Inventory cannot be deleted because it has stock",
    };
  }

  return await prisma.productInventory.update({
    where: {
      id_product_id_warehouse: { id_product, id_warehouse },
    },
    data: { active: false },
  });
};

module.exports = {
  getAllInventories,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
