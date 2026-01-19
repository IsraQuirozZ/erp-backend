const prisma = require("../config/prisma");

// Items from an order managed in: client-order

// getSClientOrderItemById -> Just for admin (debug)
// .../client-order/:id_client_order/product/:id_product
const getClientrOrderItemsById = async (id_client_order, id_product) => {
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

// createClientOrderItem
const createClientOrderItem = async (data) => {
  try {
    const clientOrder = await prisma.clientOrder.findUnique({
      where: { id_client_order: data.id_client_order },
    });

    if (!clientOrder) {
      throw {
        status: 400,
        message: "The Client Order provided does not exist",
      };
    }

    if (clientOrder.status !== "PENDING") {
      throw {
        status: 409,
        message: `Cannot add Order Item from the Order --${clientOrder.id_client_order}--, Order Status: ${clientOrder.status}`,
      };
    }

    const product = await prisma.product.findUnique({
      where: { id_product: data.id_product },
    });

    if (!product || !product.active) {
      throw {
        status: 400,
        message: "The product provided does not exist or is inactive",
      };
    }

    data.unit_price = product.price;
    data.subtotal = data.unit_price * data.quantity;

    const orderItem = await prisma.clientOrderItem.create({
      data,
      include: { client_order: true, product: true }, // use of: client_ ... -> schema -> @references
    });

    // Recalculate Total
    await recalculateOrderTotal(data.id_client_order);

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

// TODO: Update if Products are updated && Order: PENDING -> in productService
const updateClientOrderItemById = async (id_client_order, id_product, data) => {
  const orderItem = await prisma.clientOrderItem.findUnique({
    where: { id_client_order_id_product: { id_client_order, id_product } },
    include: { client_order: true, product: true },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Client Order Item not found",
    };
  }

  const product = await prisma.product.findUnique({
    where: { id_product: orderItem.id_product },
  });

  if (!product || !product.active) {
    throw {
      status: 400,
      message: "The product provided does not exist or is inactive",
    };
  }

  // ORDER STATUS !== PENDING -> Can't update
  if (orderItem.client_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot update Order Item from the Order --${orderItem.client_order.id_client_order}--, status: ${orderItem.client_order.status}`,
    };
  }

  // Re-calculate subtotal
  const quantity =
    data.quantity !== undefined ? data.quantity : orderItem.quantity;

  const unitPrice = product.price;

  const updatedItem = await prisma.clientOrderItem.update({
    where: { id_client_order_id_product: { id_client_order, id_product } },
    data: {
      quantity,
      unit_price: unitPrice,
      subtotal: unitPrice * quantity,
    },
    include: { client_order: true, product: true },
  });

  // Recalculate Total
  await recalculateOrderTotal(updatedItem.id_client_order);

  return updatedItem;
};

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
  getClientrOrderItemsById,
  createClientOrderItem,
  updateClientOrderItemById,
  deleteClientOrderItemById,
};
