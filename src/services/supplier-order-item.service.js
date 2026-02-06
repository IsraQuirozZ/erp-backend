const prisma = require("../config/prisma");

// Items from an order managed in: supplier-order
const getItemsBySupplierOrder = async (id) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
  });

  if (!order) {
    throw {
      status: 400,
      message: "Supplier Order not found",
    };
  }
  return (items = await prisma.supplierOrderItem.findMany({
    where: { id_supplier_order: id },
    include: { component: true },
  }));
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

// Create Supplier Order Item
const createSupplierOrderItem = async (data) => {
  try {
    const order = await prisma.supplierOrder.findUnique({
      where: { id_supplier_order: data.id_supplier_order },
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
      where: { id_component: data.id_component },
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
        message: "The component does not belong to the supplier of this order",
      };
    }

    const existingItem = await prisma.supplierOrderItem.findFirst({
      where: {
        id_supplier_order: data.id_supplier_order,
        id_component: data.id_component,
      },
    });

    if (existingItem) {
      throw {
        status: 400,
        message: "This component is already included in the order",
      };
    }

    // Prices
    let unit_price = component.price;
    let subtotal = unit_price * data.quantity;
    if (data.taxes) {
      subtotal += (Number(data.taxes) * subtotal) / 100;
    }
    if (data.discounts) {
      subtotal -= (Number(data.discounts) * subtotal) / 100;
    }

    data.unit_price = unit_price;
    data.subtotal = subtotal;

    const orderItem = await prisma.supplierOrderItem.create({
      data: {
        id_supplier_order: data.id_supplier_order,
        id_component: component.id_component,
        quantity: data.quantity,
        unit_price: unit_price,
        // taxes: data.taxes,
        // discounts: data.discounts,
        subtotal: subtotal,
      },
      include: { component: true, supplier_order: true },
    });

    await recalculateOrderTotal(orderItem.id_supplier_order);

    return orderItem;
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

const deleteSupplierOrderItemById = async (id) => {
  const orderItem = await prisma.supplierOrderItem.findUnique({
    where: { id_supplier_order_item: id },
    include: { supplier_order: true },
  });

  if (!orderItem) {
    throw {
      status: 400,
      message: "Supplier order item not found",
    };
  }

  // ORDER STATUS !== PENDING -> Can't delete
  if (orderItem.supplier_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot delete Order Item from the Order --${orderItem.supplier_order.id_supplier_order}--, status: ${orderItem.supplier_order.status}`,
    };
  }

  const deletedItem = await prisma.supplierOrderItem.delete({
    where: { id_supplier_order_item: id },
    include: { supplier_product: true, supplier_order: true },
  });

  // Recalculate Total
  await recalculateOrderTotal(deletedItem.id_supplier_order);

  return deletedItem;
};

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
  getSupplierOrderItemsById,
  createSupplierOrderItem,
  updateSupplierOrderItemById,
  deleteSupplierOrderItemById,
};
