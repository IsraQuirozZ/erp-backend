const prisma = require("../config/prisma");

const getAllSupplierOrders = async ({ skip, take, where, orderBy }) => {
  return await prisma.supplierOrder.findMany({
    where: where || {},
    skip,
    take,
    orderBy: orderBy || {
      created_at: "asc",
    },
    include: { supplier: true },
  });
};

const countOrders = async (where) => {
  return await prisma.supplierOrder.count({
    where: where || {},
  });
};

const getSupplierOrderById = async (id) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
    include: {
      supplier: true,
      warehouse: true,
      invoices: true,
    },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }

  return order;
};

// CREATE
const createSupplierOrder = async (data) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: data.id_supplier },
  });

  if (!supplier || supplier.active === false) {
    throw {
      status: 400,
      message: "The supplier provided does not exist or is not active",
    };
  }

  const supplierProducts = await prisma.component.findMany({
    where: { id_supplier: data.id_supplier, active: true },
  });

  if (supplierProducts.length === 0) {
    throw {
      status: 400,
      message: "The supplier provided does not have active products",
    };
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { id_warehouse: data.id_warehouse },
  });

  if (!warehouse || warehouse.active === false) {
    throw {
      status: 400,
      message: "The warehouse provided does not exist or is not active",
    };
  }

  const existingOrder = await prisma.supplierOrder.findFirst({
    where: { id_supplier: data.id_supplier, status: "PENDING", active: true },
  });

  if (existingOrder) {
    return existingOrder;
  }

  return await prisma.supplierOrder.create({
    data: {
      id_supplier: data.id_supplier,
      id_warehouse: data.id_warehouse,
      status: "PENDING",
      total: 0,
      active: true,
    },
    include: {
      supplier: true,
      warehouse: true,
    },
  });
};

// UPDATE
const updateSupplierOrderById = async (id, newStatus) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
    include: { items: true },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }

  if (order.status === "RECEIVED") {
    throw {
      status: 409,
      message: "A received order cannot be modified",
    };
  }

  const validTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["RECEIVED"],
    CANCELLED: [],
  };

  const allowed = validTransitions[order.status] || [];

  if (!allowed.includes(newStatus)) {
    throw {
      status: 409,
      message: `Cannot change status from ${order.status} to ${newStatus}`,
    };
  }

  if (newStatus === "CONFIRMED" && order.items.length === 0) {
    throw { status: 400, message: "Cannot confirm an order without items" };
  }

  // NOT RECEIVED
  if (!(order.status === "CONFIRMED" && newStatus === "RECEIVED")) {
    const updateData = { status: newStatus };

    if (order.status === "PENDING" && newStatus === "CONFIRMED") {
      const estimatedDays = 5;
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + estimatedDays);
      updateData.expected_delivery_date = expectedDate;
    }

    if (newStatus === "CANCELLED") {
      updateData.delivery_at = null;
    }

    return await prisma.supplierOrder.update({
      where: { id_supplier_order: id },
      data: updateData,
      include: { supplier: true },
    });
  }

  //  RECEIVED
  return await prisma.$transaction(async (tx) => {
    if (order.items.length === 0) {
      throw {
        status: 409,
        message: "Cannot receive an order without items",
      };
    }

    const updatedOrder = await tx.supplierOrder.update({
      where: { id_supplier_order: id },
      data: {
        status: "RECEIVED",
        delivery_at: new Date(),
      },
      include: { items: true },
    });

    const warehouseId = order.id_warehouse;

    for (const item of updatedOrder.items) {
      const existingInventory = await tx.componentInventory.findUnique({
        where: {
          id_component_id_warehouse: {
            id_component: item.id_component,
            id_warehouse: warehouseId,
          },
        },
      });

      if (!existingInventory) {
        await tx.componentInventory.create({
          data: {
            id_component: item.id_component,
            id_warehouse: warehouseId,
            current_stock: item.quantity,
            min_stock: 0,
            max_stock: 999999,
          },
        });
      } else {
        await tx.componentInventory.update({
          where: {
            id_component_id_warehouse: {
              id_component: item.id_component,
              id_warehouse: warehouseId,
            },
          },
          data: {
            current_stock: {
              increment: item.quantity,
            },
          },
        });
      }

      await tx.inventoryMovement.create({
        data: {
          movement_type: "IN",
          quantity: item.quantity,
          id_component: item.id_component,
          id_warehouse: warehouseId,
          id_supplier_order: updatedOrder.id_supplier_order,
        },
      });
    }

    return updatedOrder;
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
  countOrders,
  getSupplierOrderById,
  createSupplierOrder,
  updateSupplierOrderById,
  deleteSupplierOrderById,
};
