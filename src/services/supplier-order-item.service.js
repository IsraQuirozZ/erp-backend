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

    const existingItem = await prisma.supplierOrderItem.findUnique({
      where: {
        id_supplier_order_id_component: {
          id_supplier_order,
          id_component,
        },
      },
    });

    // Final quantity
    const finalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    //Recalculate subtotal
    const base = unitPrice * finalQuantity;
    const taxAmount = (base * tax) / 100;
    const discountAmount = (base * discount) / 100;
    const subtotal = base + taxAmount - discountAmount;

    // UPSERT item
    const item = await prisma.supplierOrderItem.upsert({
      where: {
        id_supplier_order_id_component: {
          id_supplier_order,
          id_component,
        },
      },
      create: {
        quantity: finalQuantity,
        unit_price: unitPrice,
        tax,
        discount,
        subtotal,

        // CONECT RELATIONS
        supplier_order: {
          connect: { id_supplier_order },
        },
        component: {
          connect: { id_component },
        },
      },
      update: {
        quantity: finalQuantity,
        tax,
        discount,
        subtotal,
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

// Update Supplier Order Item (inline edit) - Order must be PENDING
const updateSupplierOrderItemById = async (
  id_supplier_order,
  id_component,
  data,
) => {
  const { quantity, tax = 0, discount = 0 } = data;

  // 1. Get existing order item
  const orderItem = await prisma.supplierOrderItem.findUnique({
    where: {
      id_supplier_order_id_component: {
        id_supplier_order,
        id_component,
      },
    },
    include: {
      supplier_order: true,
      component: true,
    },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Supplier Order Item not found",
    };
  }

  // 2. Order must be PENDING
  if (orderItem.supplier_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot update Items from Order #${orderItem.supplier_order.id_supplier_order} (status: ${orderItem.supplier_order.status})`,
    };
  }

  // 3. Determine final values
  const finalQuantity = quantity !== undefined ? quantity : orderItem.quantity;

  const finalTax = tax !== undefined ? tax : orderItem.tax;

  const finalDiscount = discount !== undefined ? discount : orderItem.discount;

  const unitPrice = Number(orderItem.unit_price);

  // 4. Recalculate subtotal (FULL calculation)
  const base = unitPrice * finalQuantity;
  const taxAmount = (base * finalTax) / 100;
  const discountAmount = (base * finalDiscount) / 100;
  const subtotal = base + taxAmount - discountAmount;

  // 5. Update item
  const updatedItem = await prisma.supplierOrderItem.update({
    where: {
      id_supplier_order_id_component: {
        id_supplier_order,
        id_component,
      },
    },
    data: {
      quantity: finalQuantity,
      tax: finalTax,
      discount: finalDiscount,
      subtotal,
    },
    include: {
      supplier_order: true,
      component: true,
    },
  });

  // 6. Recalculate order total
  await recalculateOrderTotal(id_supplier_order);

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
