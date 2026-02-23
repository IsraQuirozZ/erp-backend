const prisma = require("../config/prisma");

// getAllClientOrders
const getAllClientOrders = async ({ skip, take, where, orderBy }) => {
  return await prisma.clientOrder.findMany({
    where: where || {},
    skip,
    take,
    orderBy: orderBy || {
      created_at: "asc",
    },
    include: { client: true },
  });
};

// countOrders
const countOrders = async (where) => {
  return await prisma.clientOrder.count({
    where: where || {},
  });
};

// getClientOrderById
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

// createClientOrder
const createClientOrder = async (data) => {
  const client = await prisma.client.findUnique({
    where: { id_client: data.id_client },
  });

  if (!client || client.active === false) {
    throw {
      status: 400,
      message: "The client provided does not exist or is inactive",
    };
  }

  const products = await prisma.product.findMany({
    where: { active: true },
  });

  if (products.length === 0) {
    throw {
      status: 400,
      message: "No active products available to create an order",
    };
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { id_warehouse: data.id_warehouse },
  });

  if (!warehouse || warehouse.active === false) {
    throw {
      status: 400,
      message: "The warehouse provided does not exist or is inactive",
    };
  }

  // ORDER MUST BE PENDING TO COUNT AS EXISTING
  const existingOrder = await prisma.clientOrder.findFirst({
    where: { id_client: data.id_client, status: "PENDING" },
  });

  if (existingOrder) {
    return existingOrder;
  }

  return await prisma.clientOrder.create({
    data: {
      id_client: data.id_client,
      id_warehouse: data.id_warehouse,
      status: "PENDING",
      total: 0,
    },
    include: {
      client: true,
      warehouse: true,
    },
  });
};

// updateClientOrderById
const updateClientOrderById = async (id, newStatus) => {
  const order = await prisma.clientOrder.findUnique({
    where: { id_client_order: id },
    include: {
      items: { include: { product: { include: { components: true } } } },
      shipment: true,
    },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Client Order not found",
    };
  }

  if (order.status === "RECEIVED") {
    throw {
      status: 409,
      message: `Received order cannot be modified`,
    };
  }

  const validTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CANCELLED"],
    CANCELLED: ["PENDING"],
  };

  if (!validTransitions[order.status]?.includes(newStatus)) {
    throw {
      status: 409,
      message: `Cannot change status from ${order.status} to ${newStatus}`,
    };
  }

  // PENDING -> CONFIRMED
  if (order.status === "PENDING" && newStatus === "CONFIRMED") {
    if (order.items.length === 0) {
      throw {
        status: 400,
        message: "Cannot confirm an order without items",
      };
    }

    return await prisma.$transaction(async (tx) => {
      const warehouseId = order.id_warehouse;

      // Calculate Component Consumption
      const componentConsumption = {};

      for (const item of order.items) {
        for (const pc of item.product.components) {
          const totalRequired = pc.quantity * item.quantity;

          if (!componentConsumption[pc.id_component]) {
            componentConsumption[pc.id_component] = 0;
          }
          componentConsumption[pc.id_component] += totalRequired;
        }
      }

      // Validate Stock
      for (const componentId in componentConsumption) {
        const inventory = await tx.componentInventory.findUnique({
          where: {
            id_component_id_warehouse: {
              id_component: Number(componentId),
              id_warehouse: warehouseId,
            },
          },
        });

        if (
          !inventory ||
          inventory.current_stock < componentConsumption[componentId]
        ) {
          throw {
            status: 400,
            message: `Insufficient stock for component ${componentId}`,
          };
        }
      }

      // Descount Stock & Create inventoryMovement (OUT)
      for (const componentId in componentConsumption) {
        const quantity = componentConsumption[componentId];

        await tx.componentInventory.update({
          where: {
            id_component_id_warehouse: {
              id_component: Number(componentId),
              id_warehouse: warehouseId,
            },
            data: {
              current_stock: { decrement: quantity },
            },
          },
        });

        await tx.inventoryMovement.create({
          data: {
            id_component: Number(componentId),
            id_warehouse: warehouseId,
            id_client_order: id,
            movement_type: "OUT",
            quantity: quantity,
          },
        });
      }

      // CREATE SHIPMENT
      const shipment = await tx.shipment.create({
        data: {
          id_warehouse: warehouseId,
          shipping_company: "Default Shipping Co.",
          shipping_cost: 0,
          status: "PENDING",
          shipment_date: new Date(),
          estimated_delivery_date: new Date(
            new Date().setDate(new Date().getDate() + 5),
          ),
        },
      });

      // UPDATE ORDER
      return await tx.clientOrder.update({
        where: { id_client_order: id },
        data: {
          status: "CONFIRMED",
          id_shipment: shipment.id_shipment,
        },
      });
    });
  }

  // CONFIRMED -> CANCELLED
  if (order.status === "CONFIRMED" && newStatus === "CANCELLED") {
    return await prisma.$transaction(async (tx) => {
      const warehouseId = order.id_warehouse;

      const componentConsumption = {};

      for (const item of order.items) {
        for (const pc of item.product.components) {
          const totalNeeded = pc.quantity * item.quantity;

          if (!componentConsumption[pc.id_component]) {
            componentConsumption[pc.id_component] = 0;
          }

          componentConsumption[pc.id_component] += totalNeeded;
        }
      }

      // RETURN STOCK & Create inventoryMovement (IN)
      for (const componentId in componentConsumption) {
        const quantity = componentConsumption[componentId];

        await tx.supplierProductInventory.update({
          where: {
            id_component_id_warehouse: {
              id_component: Number(componentId),
              id_warehouse: warehouseId,
            },
          },
          data: {
            current_stock: { increment: quantity },
          },
        });

        await tx.inventoryMovement.create({
          data: {
            id_component: Number(componentId),
            id_warehouse: warehouseId,
            id_client_order: id,
            movement_type: "IN",
            quantity: quantity,
          },
        });
      }

      // CANCEL SHIPMENT IF EXISTS
      if (order.shipment) {
        await tx.shipment.update({
          where: { id_shipment: order.shipment.id_shipment },
          data: { status: "CANCELLED" },
        });
      }

      // CANCEL ORDER
      return await tx.clientOrder.update({
        where: { id_client_order: id },
        data: { status: "CANCELLED" },
      });
    });
  }

  // PENDING -> CANCELLED
  return await prisma.clientOrder.update({
    where: { id_client_order: id },
    data: { status: newStatus },
  });
};

// ONLY FOR DEBUGGING PURPOSES, NOT EXPOSED IN CONTROLLER
const deleteClientOrderById = async (id) => {
  const order = await prisma.clientOrder.findUnique({
    where: { id_client_order: id },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Client Order not found",
    };
  }

  if (order.status !== "CANCELLED") {
    throw {
      status: 400,
      message: "Only cancelled orders can be deleted",
    };
  }

  await prisma.clientOrder.delete({
    where: { id_client_order: id },
  });

  return { message: `Client Order --${id}-- successfully deleted` };
};

module.exports = {
  getAllClientOrders,
  countOrders,
  getClientOrderById,
  createClientOrder,
  updateClientOrderById,
  deleteClientOrderById,
};
