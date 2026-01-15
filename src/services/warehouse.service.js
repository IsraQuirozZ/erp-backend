const prisma = require("../config/prisma");

const getAllWarehouses = async () => {
  return await prisma.warehouse.findMany({
    where: { active: true },
    include: { address: true },
  });
};

const getWarehouseById = async (id) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: { id_warehouse: id },
    include: { address: true },
  });

  if (!warehouse) {
    throw {
      status: 404,
      message: "Warehouse not found",
    };
  }

  return warehouse;
};

const createWarehouse = async (data) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id_address: data.id_address },
    });

    if (!address) {
      throw {
        status: 400,
        message: "The Address provided does not exist",
      };
    }

    return await prisma.warehouse.create({
      data,
      include: { address: true },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 409,
        message: "Warehouse name already exist for this address",
      };
    }
    throw error;
  }
};

const updateWarehouseById = async (id, data) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id_warehouse: id },
      include: { address: true },
    });

    if (!warehouse) {
      throw {
        status: 404,
        message: "Warehouse not found",
      };
    }

    if (!warehouse.active && data.active !== true) {
      throw {
        status: 400,
        message: "Inactive warehouse can only be reactivated",
      };
    }

    return await prisma.warehouse.update({
      where: { id_warehouse: id },
      data,
      include: { address: true },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "Warehouse with this name already exist for this address",
      };
    }
    throw error;
  }
};

// TODO: Don't delete if it has: inventory-shipments
const deleteWarehouseById = async (id) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: { id_warehouse: id },
  });

  if (!warehouse) {
    throw {
      status: 400,
      message: "Warehouse not found",
    };
  }

  return await prisma.warehouse.update({
    where: { id_warehouse: id },
    include: { address: true },
    data: { active: false },
  });
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouseById,
  deleteWarehouseById,
};
