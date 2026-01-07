const prisma = require("../config/prisma");

const getAllSuppliers = async () => {
  return prisma.supplier.findMany({
    orderBy: {
      name: "asc",
    },
    include: { address: true },
  });
};

const getSupplierById = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: id },
    include: { address: true },
  });

  if (!supplier) {
    throw {
      status: 404,
      message: "Supplier not found",
    };
  }

  return supplier;
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

const updateSupplier = async (id, data) => {
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

// RULE FOR THE FUTURE --> Can not be deleted if it has associated records (orders,payments, invoices... etc)
const deleteSupplier = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: id },
  });

  if (!supplier) {
    throw {
      status: 404,
      message: "Supplier not found",
    };
  }

  await prisma.supplier.delete({
    where: { id_supplier: id },
    include: { address: true },
  });

  return supplier;
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
