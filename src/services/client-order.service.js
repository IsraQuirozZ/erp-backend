const prisma = require("../config/prisma");

const getAllClientOrders = async () => {
  return await prisma.clientOrder.findMany({
    orderBy: {
      created_at: "asc",
    },
    include: { client: true },
  });
};

const getClientOrderById = async (id) => {
  const order = await prisma.clientOrder.findUnique({
    where: { id_client_order: id },
    include: { client: true },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Client Order not found",
    };
  }

  return order;
};

// getItemsByClientOrder
const getItemsByClientOrder = async (orderId) => {
  const order = await prisma.clientOrder.findUnique({
    where: { id_client_order: orderId },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }

  //  `${item.supplier_product.name} ${item.unit_price} ${item.quantity} ${item.subtotal}`

  return (items = await prisma.clientOrderItem.findMany({
    where: { id_client_order: orderId },
    include: { product: true },
  }));
};

const createClientOrder = async (data) => {
  const client = await prisma.client.findUnique({
    where: { id_client: data.id_client },
  });

  if (!client) {
    throw {
      status: 400,
      message: "The client provided does not exist",
    };
  }

  return await prisma.clientOrder.create({
    data: {
      id_client: data.id_client,
      status: "PENDING",
      total: 0,
    },
    include: { client: true },
  });
};

const updateClientOrderById = async (id, data) => {
  const order = await prisma.clientOrder.findUnique({
    where: { id_client_order: id },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Client Order not found",
    };
  }

  // If status: RECEIVED -> NO UPDATES ALLOWED
  if (order.status === "RECEIVED" || order.status === "CANCELLED") {
    throw {
      status: 409,
      message: `A ${order.status.toLowerCase()} order cannot be modified`,
    };
  }

  // Status transition rules
  // TODO: validate shipment status is DELIVERED before marking order as RECEIVED
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

  if (data.status === "CONFIRMED") {
    // check order has items -> orderItems.count > 0

    // Decide warehouse (change later) -> warehouse ID: 4 (name: Main, type: main)
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        warehouse_type: "MAIN",
        active: true,
      },
    });

    if (!warehouse) {
      throw {
        status: 400,
        message: "No active MAIN warehouse available",
      };
    }

    // Create Shipment
    const shipment = await prisma.shipment.create({
      data: {
        id_warehouse: warehouse.id_warehouse,
        shipping_company: "Default Shipping Company",
        shipping_cost: 10.0,
        status: "PENDING",
        shipment_date: null,
        estimated_delivery_date: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 5);
          return d;
        })(),
        actual_delivery_date: null,
      },
    });

    data.id_shipment = shipment.id_shipment;
    data.expected_delivery_date = shipment.estimated_delivery_date;
  }

  return await prisma.clientOrder.update({
    where: { id_client_order: id },
    data,
    include: {
      client: true,
    },
  });
};

const cancelClientOrderById = async (id) => {
  const order = await prisma.clientOrder.findUnique({
    where: { id_client_order: id },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Client Order not found",
    };
  }

  if (order.status === "PENDING" || order.status === "CONFIRMED") {
    const itemsCount = await prisma.clientOrderItem.count({
      where: { id_client_order: id },
    });

    if (itemsCount > 0) {
      throw {
        status: 400,
        message: `Order --${order.id_client_order}-- cannot be deleted because it has associated items`,
      };
    }

    return await prisma.clientOrder.update({
      where: { id_client_order: id },
      include: { client: true },
      data: { status: "CANCELLED" },
    });
  } else {
    throw {
      status: 400,
      message: `The Order --${order.id_client_order}-- cannot be Cancelled, status: ${order.status}`,
    };
  }
};

module.exports = {
  getAllClientOrders,
  getClientOrderById,
  getItemsByClientOrder,
  createClientOrder,
  updateClientOrderById,
  cancelClientOrderById,
};
