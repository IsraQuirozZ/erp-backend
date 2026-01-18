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

// getItemsBySupplierOrder
const getItemsBySupplierOrder = async (orderId) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: orderId },
  });

  if (!order) {
    throw {
      status: 400,
      message: "Supplier Order not found",
    };
  }

  //   `${item.supplier_product.name} ${item.unit_price} ${item.quantity} ${item.subtotal}`

  return (items = await prisma.supplierOrderItem.findMany({
    where: { id_supplier_order: orderId },
    include: { supplier_product: true },
  }));
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

const updateSupplierOrderById = async (id, data) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }

  // If status: RECEIVED -> NO UPDATES ALLOWED
  if (order.status === "RECEIVED") {
    throw {
      status: 409,
      message: "A received order cannot be modified",
    };
  }

  // Status transition rules
  if (data.status) {
    const validTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["RECEIVED"],
      CANCELLED: [],
    };

    const allowed = validTransitions[order.status] || [];

    if (!allowed.includes(data.status)) {
      throw {
        status: 409,
        message: `Cannot change status from ${order.status} to ${data.status}`,
      };
    }
  }

  // expecte_delivery_date -> Modification no possible
  if (order.status === "CANCELLED") {
    data.expected_delivery_date = order.expected_delivery_date;
  }

  return await prisma.supplierOrder.update({
    where: { id_supplier_order: id },
    data,
    include: {
      supplier: true,
    },
  });
};

const deleteSupplierOrderById = async (id) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }

  if (order.status === "PENDING" || order.status === "CONFIRMED") {
    const itemsCount = await prisma.supplierOrderItem.count({
      where: { id_supplier_order: id },
    });

    if (itemsCount > 0) {
      throw {
        status: 400,
        message: `Order --${order.id_supplier_order}-- cannot be deleted because it has associated items`,
      };
    }

    return await prisma.supplierOrder.update({
      where: { id_supplier_order: id },
      include: { supplier: true },
      data: { active: false },
    });
  } else {
    throw {
      status: 400,
      message: `The Order --${order.id_supplier_order}-- cannot be deleted, status: ${order.status}`,
    };
  }
};

module.exports = {
  getAllSupplierOrders,
  getSupplierOrderById,
  getItemsBySupplierOrder,
  createSupplierOrder,
  updateSupplierOrderById,
  deleteSupplierOrderById,
};
