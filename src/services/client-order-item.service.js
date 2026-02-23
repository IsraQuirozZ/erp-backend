const prisma = require("../config/prisma");

// getItemsByClientOrder
const getItemsByClientOrder = async (id, { skip, take, orderBy } = {}) => {
  const order = await prisma.clientOrder.findUnique({
    where: { id_client_order: id },
  });

  if (!order) {
    throw {
      status: 400,
      message: "Client Order not found",
    };
  }

  return await prisma.clientOrderItem.findMany({
    where: { id_client_order: id },
    include: { product: true },
    skip,
    take,
    orderBy: orderBy || {
      product: { name: "asc" },
    },
  });
};

// Count Items in order
const countItemsByClientOrder = async (id) => {
  return await prisma.clientOrderItem.count({
    where: { id_client_order: id },
  });
};

// getClientOrderItemById -> Just for admin (debug)
const getClientOrderItemsById = async (id_client_order, id_product) => {
  const orderItems = await prisma.clientOrderItem.findUnique({
    where: { id_client_order_id_product: { id_client_order, id_product } },
    include: { client_order: true, product: true },
  });

  if (!orderItems) {
    throw {
      status: 404,
      message: "Client Order Item not found",
    };
  }

  return orderItems;
};

// Create (UPSERT) Client Order Item
const createClientOrderItem = async (data) => {
  try {
    const {
      id_client_order,
      id_product,
      quantity,
      tax = 0,
      discount = 0,
    } = data;

    // VALIDATE ORDER
    const order = await prisma.clientOrder.findUnique({
      where: { id_client_order },
    });

    if (!order) {
      throw {
        status: 400,
        message: "The client order provided does not exist",
      };
    }

    if (order.status !== "PENDING") {
      throw {
        status: 409,
        message: `Cannot add items to order #${order.id_client_order} (status: ${order.status})`,
      };
    }

    // VALIDATE PRODUCT
    const product = await prisma.product.findUnique({
      where: { id_product },
    });

    if (!product || product.active === false) {
      throw {
        status: 400,
        message: "The product provided does not exist or is not active",
      };
    }

    const unitPrice = Number(product.price);

    // CHECK EXISTING ITEM (COMPOSITE PK)
    const existingItem = await prisma.clientOrderItem.findUnique({
      where: {
        id_client_order_id_product: {
          id_client_order,
          id_product,
        },
      },
    });

    const finalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    // CALCULATE SUBTOTAL
    const base = unitPrice * finalQuantity;
    const taxAmount = (base * tax) / 100;
    const discountAmount = (base * discount) / 100;
    const subtotal = base + taxAmount - discountAmount;

    // UPSERT
    const item = await prisma.clientOrderItem.upsert({
      where: {
        id_client_order_id_product: {
          id_client_order,
          id_product,
        },
      },
      create: {
        quantity: finalQuantity,
        unit_price: unitPrice,
        tax,
        discount,
        subtotal,
        client_order: {
          connect: { id_client_order },
        },
        product: {
          connect: { id_product },
        },
      },
      update: {
        quantity: finalQuantity,
        tax,
        discount,
        subtotal,
      },
    });

    await recalculateOrderTotal(id_client_order);

    return item;
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "This product already exists in the order",
      };
    }
    throw error;
  }
};

// updateClientOrderItemById (inline edit) -> Order must be PENDING
const updateClientOrderItemById = async (id_client_order, id_product, data) => {
  const { quantity, tax = 0, discount = 0 } = data;

  // EXISTING ITEM
  const orderItem = await prisma.clientOrderItem.findUnique({
    where: {
      id_client_order_id_product: {
        id_client_order,
        id_product,
      },
    },
    include: {
      client_order: true,
      product: true,
    },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Client Order Item not found",
    };
  }

  // ORDER STATUS !== PENDING -> Can't update
  if (orderItem.client_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot update items from Order #${orderItem.client_order.id_client_order} (status: ${orderItem.client_order.status})`,
    };
  }

  // FINAL VALUES
  const finalQuantity = quantity !== undefined ? quantity : orderItem.quantity;

  const finalTax = tax !== undefined ? tax : orderItem.tax;

  const finalDiscount = discount !== undefined ? discount : orderItem.discount;

  const unitPrice = Number(orderItem.unit_price);

  // RECALCULATE SUBTOTAL
  const base = unitPrice * finalQuantity;
  const taxAmount = (base * finalTax) / 100;
  const discountAmount = (base * finalDiscount) / 100;
  const subtotal = base + taxAmount - discountAmount;

  // UPDATE
  const updatedItem = await prisma.clientOrderItem.update({
    where: {
      id_client_order_id_product: {
        id_client_order,
        id_product,
      },
    },
    data: {
      quantity: finalQuantity,
      tax: finalTax,
      discount: finalDiscount,
      subtotal,
    },
    include: {
      client_order: true,
      product: true,
    },
  });

  await recalculateOrderTotal(id_client_order);

  return updatedItem;
};

// deleteClientOrderItemById -> Only if order is PENDING
const deleteClientOrderItemById = async (id_client_order, id_product) => {
  const orderItem = await prisma.clientOrderItem.findUnique({
    where: { id_client_order_id_product: { id_client_order, id_product } },
    include: { client_order: true },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Client order item not found",
    };
  }

  // ORDER STATUS !== PENDING -> Can't delete
  if (orderItem.client_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot delete Order Item from the Order --${orderItem.client_order.id_client_order}--, status: ${orderItem.client_order.status}`,
    };
  }

  const deletedItem = await prisma.clientOrderItem.delete({
    where: { id_client_order_id_product: { id_client_order, id_product } },
    include: { client_order: true, product: true },
  });

  // Recalculate Total
  await recalculateOrderTotal(deletedItem.id_client_order);

  return deletedItem;
};

// RECALCULATE ORDER TOTAL
const recalculateOrderTotal = async (orderId) => {
  // Get all items
  const items = await prisma.clientOrderItem.findMany({
    where: { id_client_order: orderId },
    select: { subtotal: true },
  });

  // Calculate total
  const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  // Update client order total
  await prisma.clientOrder.update({
    where: { id_client_order: orderId },
    data: { total },
  });
};

module.exports = {
  getItemsByClientOrder,
  countItemsByClientOrder,
  getClientOrderItemsById,
  createClientOrderItem,
  updateClientOrderItemById,
  deleteClientOrderItemById,
};
