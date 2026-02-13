const prisma = require("../config/prisma");

// GET COMPONENT INVENTORY BY ID
const getInventoryById = async (id_component, id_warehouse) => {
  const inventory = await prisma.componentInventory.findUnique({
    where: {
      id_component_id_warehouse: {
        id_component,
        id_warehouse,
      },
    },
    include: {
      component: true,
      warehouse: true,
    },
  });

  if (!inventory) {
    throw {
      status: 404,
      message: "Inventory not found",
    };
  }

  return inventory;
};

// UPDATE COMPONENT INVENTORY (MIN/MAX STOCK)
const updateComponentInventory = async (id_component, id_warehouse, data) => {
  const { min_stock, max_stock } = data;
  const inventory = await prisma.componentInventory.findUnique({
    where: {
      id_component_id_warehouse: {
        id_component,
        id_warehouse,
      },
    },
  });

  if (!inventory) {
    throw {
      status: 404,
      message: "Inventory not found",
    };
  }

  return (updatedInventory = await prisma.componentInventory.update({
    where: {
      id_component_id_warehouse: {
        id_component,
        id_warehouse,
      },
    },
    data: data,
  }));
};

module.exports = {
  getInventoryById,
  updateComponentInventory,
};
