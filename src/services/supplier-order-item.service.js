const prisma = require("../config/prisma");

// GET ITEMS BY SUPPLIER ORDER
const getItemsBySupplierOrder = async (id, { skip, take, orderBy } = {}) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
  });

  if (!order) {
    throw {
      status: 400,
      message: "Supplier Order not found",
    };
  }

  return await prisma.supplierOrderItem.findMany({
    where: { id_supplier_order: id },
    include: { component: true },
    skip,
    take,
    orderBy: orderBy || {
      component: { name: "asc" },
    },
  });
};

// Count Items in order
const countItemsBySupplierOrder = async (id) => {
  return await prisma.supplierOrderItem.count({
    where: { id_supplier_order: id },
  });
};

// getSupplierOrderItemById -> Just for admin (debug)
const getSupplierOrderItemsById = async (id) => {
  const orderItems = await prisma.supplierOrderItem.findUnique({
    where: { id_supplier_order_item: id },
    include: { supplier_product: true },
  });

  if (!orderItems) {
    throw {
      status: 404,
      message: "Supplier Order Item not found",
    };
  }

  return orderItems;
};

// Create (UPSERT) Supplier Order Item
const createSupplierOrderItem = async (data) => {
  try {
    const {
      id_supplier_order,
      id_component,
      quantity,
      tax = 0,
      discount = 0,
    } = data;

    const order = await prisma.supplierOrder.findUnique({
      where: { id_supplier_order },
    });

    if (!order) {
      throw {
        status: 400,
        message: "The supplier order provided does not exist",
      };
    }

    if (order.status !== "PENDING") {
      throw {
        status: 409,
        message: `Cannot add Items to order #${order.id_supplier_order} (status: ${order.status})`,
      };
    }

    const component = await prisma.component.findUnique({
      where: { id_component },
    });

    if (!component || component.active === false) {
      throw {
        status: 400,
        message: "The component provided does not exist or is not active",
      };
    }

    if (component.id_supplier !== order.id_supplier) {
      throw {
        status: 400,
        message: "The component does not belong to this supplier",
      };
    }

    const unitPrice = component.price;

    // UPSERT item
    const item = await prisma.supplierOrderItem.upsert({
      where: {
        id_supplier_order_id_component: {
          id_supplier_order,
          id_component,
        },
      },
      create: {
        quantity,
        unit_price: unitPrice,
        tax,
        discount,
        subtotal:
          unitPrice * quantity +
          (unitPrice * quantity * tax) / 100 -
          (unitPrice * quantity * discount) / 100,

        // CONECT RELATIONS
        supplier_order: {
          connect: { id_supplier_order },
        },
        component: {
          connect: { id_component },
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
        subtotal: {
          increment:
            unitPrice * quantity +
            (unitPrice * quantity * tax) / 100 -
            (unitPrice * quantity * discount) / 100,
        },
      },
    });

    await recalculateOrderTotal(id_supplier_order);
    return item;
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "An order already has this supplier and supplier product",
      };
    }
    throw error;
  }
};

// Update if Products are updated && Order: PENDING
const updateSupplierOrderItemById = async (id, data) => {
  const orderItem = await prisma.supplierOrderItem.findUnique({
    where: { id_supplier_order_item: id },
    include: { supplier_product: true, supplier_order: true },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Supplier Order Item not found",
    };
  }

  const supplierProduct = await prisma.supplierProduct.findUnique({
    where: { id_supplier_product: orderItem.id_supplier_product },
  });

  // ORDER STATUS !== PENDING -> Can't update
  if (orderItem.supplier_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot update Order Item from the Order --${orderItem.supplier_order.id_supplier_order}--, status: ${orderItem.supplier_order.status}`,
    };
  }

  // Re-calculate subtotal
  const quantity =
    data.quantity !== undefined ? data.quantity : orderItem.quantity;

  const unitPrice = supplierProduct.purchase_price;

  const updatedItem = await prisma.supplierOrderItem.update({
    where: { id_supplier_order_item: id },
    data: {
      quantity,
      unit_price: unitPrice,
      subtotal: unitPrice * quantity,
    },
    include: { supplier_order: true, supplier_product: true },
  });

  // Recalculate Total
  await recalculateOrderTotal(updatedItem.id_supplier_order);

  return updatedItem;
};

// DELETE -> Only if order is PENDING
const deleteSupplierOrderItemById = async ({
  id_supplier_order,
  id_component,
}) => {
  const orderItem = await prisma.supplierOrderItem.findUnique({
    where: {
      id_supplier_order_id_component: {
        id_supplier_order: id_supplier_order,
        id_component: id_component,
      },
    },
    include: { supplier_order: true, component: true },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Supplier order item not found",
    };
  }

  // ORDER STATUS !== PENDING -> Can't delete
  if (orderItem.supplier_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot delete Item from the Order #${orderItem.supplier_order.id_supplier_order} (status: ${orderItem.supplier_order.status})`,
    };
  }

  const deletedItem = await prisma.supplierOrderItem.delete({
    where: {
      id_supplier_order_id_component: {
        id_supplier_order,
        id_component,
      },
    },
    include: { component: true, supplier_order: true },
  });

  // Recalculate Total
  await recalculateOrderTotal(deletedItem.id_supplier_order);

  return deletedItem;
};

// RECALCULATE ORDER TOTAL
const recalculateOrderTotal = async (orderId) => {
  // Get all items
  items = await prisma.supplierOrderItem.findMany({
    where: { id_supplier_order: orderId },
    select: { subtotal: true },
  });

  // Calculate total
  const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  // Update supplier order total
  await prisma.supplierOrder.update({
    where: { id_supplier_order: orderId },
    data: { total },
  });
};

module.exports = {
  getItemsBySupplierOrder,
  countItemsBySupplierOrder,
  getSupplierOrderItemsById,
  createSupplierOrderItem,
  updateSupplierOrderItemById,
  deleteSupplierOrderItemById,
};
