const prisma = require("../config/prisma");

const getAllSupplierOrders = async () => {
  return await prisma.supplierOrder.findMany({
    where: { active: true },
    orderBy: {
      created_at: "asc",
    },
    include: { supplier: true },
  });
};

const getSupplierOrderById = async (id) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
    include: { supplier: true },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }

  return order;
};

const createSupplierOrder = async (data) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: data.id_supplier },
  });

  if (!supplier) {
    throw {
      status: 400,
      message: "The supplier provided does not exist",
    };
  }
  return await prisma.supplierOrder.create({
    data: {
      id_supplier: data.id_supplier,
      status: "PENDING",
      total: 0,
      active: true,
    },
    include: {
      supplier: true,
    },
  });
};

const updateSupplierOrder = async (id, data) => {
  const supplierOrder = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
  });

  if (!supplierOrder) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }
};

module.exports = {
  getAllSupplierOrders,
  getSupplierOrderById,
  createSupplierOrder,
};
