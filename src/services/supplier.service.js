const prisma = require("../config/prisma");

const getAllSuppliers = async () => {
  return prisma.supplier.findMany({
    where: { active: true },
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

// getProductsBySupplierId
const getProductsBySupplierId = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: id },
  });

  if (!supplier) {
    throw {
      status: 400,
      message: "Supplier not found",
    };
  }

  const products = await prisma.supplierProduct.findMany({
    where: { id_supplier: id },
  });

  return products;
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

// SOFT DELETE
// RULE FOR THE FUTURE --> Can not be deleted if it has associated records (products, orders,payments, invoices... etc)
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
  const countProducts = await prisma.supplierProduct.count({
    where: { id_supplier: id, active: true },
  });

  if (countProducts > 0) {
    throw {
      status: 409,
      message: "Supplier can not be deleted because it has associated products",
    };
  }

  return await prisma.supplier.update({
    where: { id_supplier: id },
    include: { address: true },
    data: { active: false },
  });
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  getProductsBySupplierId,
  createSupplier,
  updateSupplierById,
  deleteSupplierById,
};
