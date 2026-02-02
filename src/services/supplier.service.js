const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");
const provinceService = require("../services/province.service");
const addressService = require("../services/address.service");

const getAllSuppliers = async ({ skip, take, where, orderBy }) => {
  return prisma.supplier.findMany({
    where: where || {},
    skip,
    take,
    orderBy: orderBy || { name: "asc" },
    include: { address: { include: { province: true } } },
  });
};

const countSuppliers = async (where) => {
  return await prisma.supplier.count({
    where: where || {},
  });
};

const getSupplierById = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: id },
    include: { address: { include: { province: true } } },
  });

  if (!supplier) {
    throw {
      status: 404,
      message: "Supplier not found",
    };
  }

  return supplier;
};

// getOrdersBySupplierId
const getOrdersBySupplierId = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: id },
  });

  if (!supplier) {
    throw {
      status: 400,
      message: "Supplier not found",
    };
  }

  const orders = await prisma.supplierOrder.findMany({
    where: { id_supplier: id },
  });

  return orders;
};

const createSupplier = async (data) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id_address: data.id_address },
    });

    if (!address) {
      throw {
        status: 400,
        message: "The address provided does not exist",
      };
    }

    return await prisma.supplier.create({
      data,
      include: { address: true },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "A supplier with this email already exists",
      };
    }
    throw error;
  }
};

// USE CASE
const createFullSupplier = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { supplier, address, province } = data;

      // PROVINCE --> provinceService
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

      // SUPPLIER
      const newsupplier = await tx.supplier.create({
        data: {
          ...supplier,
          id_address: newAddress.id_address,
        },
        include: { address: true },
      });

      return newsupplier;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw {
        status: 400,
        message: "Supplier with this email already exists",
      };
    }

    throw error;
  }
};

const updateSupplierById = async (id, data) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id_supplier: id },
    });

    if (!supplier) {
      throw {
        status: 400,
        message: "Supplier not found",
      };
    }

    if (data.id_address !== undefined) {
      const address = await prisma.address.findUnique({
        where: { id_address: data.id_address },
      });

      if (!address) {
        throw {
          status: 400,
          message: "The address provided does not exist",
        };
      }
    }

    return await prisma.supplier.update({
      where: { id_supplier: id },
      include: { address: true },
      data: data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "A supplier with this email already exists",
      };
    }

    throw error;
  }
};

// USE CASE
const updateFullSupplier = async (id_supplier, data) => {
  const { supplier, address, province } = data;

  try {
    return await prisma.$transaction(async (tx) => {
      const existingSupplier = await tx.supplier.findUnique({
        where: { id_supplier },
        include: { address: true },
      });

      if (!existingSupplier) {
        throw {
          status: 404,
          message: "Supplier not found",
        };
      }

      let existingProvince = await tx.province.findFirst({
        where: { name: province.name },
      });

      if (!existingProvince) {
        existingProvince = await tx.province.create({
          data: { name: province.name },
        });
      }

      const updatedAddress = await tx.address.update({
        where: { id_address: existingSupplier.id_address },
        data: {
          ...address,
          id_province: existingProvince.id_province,
        },
      });

      const updatedSupplier = await tx.supplier.update({
        where: { id_supplier },
        data: {
          ...supplier,
        },
        include: {
          address: {
            include: {
              province: true,
            },
          },
        },
      });

      return updatedSupplier;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw {
        status: 400,
        message: "Supplier with this email already exists",
      };
    }

    throw error;
  }
};

// SOFT DELETE
// RULE FOR THE FUTURE --> Can not be deleted if it has associated records (orders,payments, invoices... etc)
const deleteSupplierById = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: id },
  });

  if (!supplier) {
    throw {
      status: 404,
      message: "Supplier not found",
    };
  }

  // If products -> Don't delete
  const countComponents = await prisma.component.count({
    where: { id_supplier: id },
  });

  if (countComponents > 0) {
    throw {
      status: 409,
      message:
        "Supplier can not be deleted because it has associated components",
    };
  }

  // If orders -> Don't delete
  const countOrders = await prisma.supplierOrder.count({
    where: { id_supplier: id },
  });

  if (countOrders > 0) {
    throw {
      status: 409,
      message: "Supplier can not be deleted because it has associated orders",
    };
  }

  if (!supplier.active) {
    return await prisma.supplier.update({
      where: { id_supplier: id },
      data: { active: true },
    });
  }

  return await prisma.supplier.update({
    where: { id_supplier: id },
    data: { active: false },
  });
};

module.exports = {
  getAllSuppliers,
  countSuppliers,
  getSupplierById,
  getOrdersBySupplierId,
  createSupplier,
  createFullSupplier, // USE CASE
  updateSupplierById,
  updateFullSupplier, // USE CASE
  deleteSupplierById,
};
