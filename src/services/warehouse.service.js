const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");
const provinceService = require("../services/province.service");
const addressService = require("../services/address.service");

const getAllWarehouses = async ({ skip, take, where, orderBy }) => {
  return await prisma.warehouse.findMany({
    where: where || {},
    skip,
    take,
    orderBy: orderBy || { name: "asc" },
    include: { address: { include: { province: true } } },
  });
};

const countWarehouses = async (where) => {
  return await prisma.warehouse.count({
    where: where || {},
  });
};

const getWarehouseById = async (id) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: { id_warehouse: id },
    include: { address: { include: { province: true } } },
  });

  if (!warehouse) {
    throw {
      status: 404,
      message: "Warehouse not found",
    };
  }

  return warehouse;
};

// USE CASE
const createWarehouse = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { warehouse, address, province } = data;

      // PROVINCE
      let existingProvince = await provinceService.getProvinceByName(
        province.name,
        tx,
      );

      if (!existingProvince) {
        existingProvince = await provinceService.createProvince(province, tx);
      }

      // ADDRESS --> addresService
      const newAddress = await addressService.createAddress(
        { ...address, id_province: existingProvince.id_province },
        tx,
      );

      // WAREHOUSE
      const newWarehouse = await tx.warehouse.create({
        data: {
          ...warehouse,
          id_address: newAddress.id_address,
        },
        include: { address: { include: { province: true } } },
      });

      return newWarehouse;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw {
        status: 409,
        message: "Warehouse name already exist for this address",
      };
    }
    throw error;
  }
};

const updateWarehouseById = async (id, data) => {
  const { warehouse, address, province } = data;
  try {
    return await prisma.$transaction(async (tx) => {
      const existingWarehouse = await tx.warehouse.findUnique({
        where: { id_warehouse: id },
        include: { address: { include: { province: true } } },
      });

      if (!existingWarehouse) {
        throw {
          status: 404,
          message: "Warehouse not found",
        };
      }

      if (!existingWarehouse.active && warehouse && warehouse.active !== true) {
        throw {
          status: 400,
          message: "Inactive warehouse can only be reactivated",
        };
      }

      let existingProvince;
      if (province && province.name) {
        existingProvince = await provinceService.getProvinceByName(
          province.name,
          tx,
        );

        if (!existingProvince) {
          existingProvince = await provinceService.createProvince(province, tx);
        }
      }

      let updatedAddress;
      if (address) {
        updatedAddress = await tx.address.update({
          where: { id_address: existingWarehouse.id_address },
          data: {
            ...address,
            id_province: existingProvince
              ? existingProvince.id_province
              : existingWarehouse.address.id_province,
          },
        });
      }

      const updatedWarehouse = await tx.warehouse.update({
        where: { id_warehouse: id },
        data: {
          ...(warehouse || {}),
        },
        include: {
          address: {
            include: {
              province: true,
            },
          },
        },
      });

      return updatedWarehouse;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
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

  if (!warehouse.active) {
    return await prisma.warehouse.update({
      where: { id_warehouse: id },
      data: { active: true },
    });
  }

  // TODO: If products

  return await prisma.warehouse.update({
    where: { id_warehouse: id },
    data: { active: false },
  });
};

module.exports = {
  getAllWarehouses,
  countWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouseById,
  deleteWarehouseById,
};
