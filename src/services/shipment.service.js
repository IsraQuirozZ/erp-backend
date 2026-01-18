const prisma = require("../config/prisma");

const getAllShipments = async () => {
  return await prisma.shipment.findMany({
    orderBy: { shipping_company: "asc" },
  });
};

// getShipmentsByStatus -> PENDING, IN_TRANSIT, DELIVERED, CANCELLED
const getShipmentsByStatus = async (status) => {
  return await prisma.shipment.findMany({
    where: { status: status },
    orderBy: { shipping_company: "asc" },
  });
};

const getShipmentById = async (id) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id_shipment: id },
  });

  if (!shipment) {
    throw {
      status: 404,
      message: "Shipment not found",
    };
  }

  return shipment;
};

// When ClientOrder status CONFIRMED -> CreateShipment (PENDING)
const createShipment = async (data) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: { id_warehouse: data.id_warehouse },
  });

  if (!warehouse) {
    throw { status: 400, message: "Warehouse provided not found" };
  }

  if (warehouse.active !== true) {
    throw {
      status: 400,
      message: "Cannot create shipment from an inactive warehouse",
    };
  }

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

  return await prisma.shipment.create({
    data: {
      id_warehouse: data.id_warehouse,
      shipping_company: data.shipping_company,
      shipping_cost: data.shipping_cost,
      status: "PENDING",
      shipment_date: null,
      estimated_delivery_date: estimatedDeliveryDate,
      actual_delivery_date: null,
    },
    include: { warehouse: true },
  });
};

// ORDER RECEIVED -> Update (status: DELIVERED)
// ORDER CANCELLED -> Updated (status: CANCELLED)
const updateShipmentById = async (id, data) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id_shipment: id },
  });

  if (!shipment) {
    throw {
      status: 404,
      message: "Shipment not found",
    };
  }

  if (shipment.status === "DELIVERED" || shipment.status === "CANCELLED") {
    throw {
      status: 400,
      message: `No updates allowed, shipment status: ${shipment.status}`,
    };
  }

  // Status transition rules
  if (data.status) {
    const validTransitions = {
      PENDING: ["IN_TRANSIT", "CANCELLED"],
      IN_TRANSIT: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    const allowed = validTransitions[shipment.status] || [];

    if (!allowed.includes(data.status)) {
      throw {
        status: 400,
        message: `Cannot change status from ${shipment.status} to ${data.status}`,
      };
    }
  }

  let shipmentDate = null;
  let actualDeliveryDate = null;

  if (data.status === "IN_TRANSIT") {
    shipmentDate = shipment.shipment_date ?? new Date();
  }

  if (data.status === "DELIVERED") {
    shipmentDate = shipment.shipment_date;
    actualDeliveryDate = new Date();
  }

  return await prisma.shipment.update({
    where: { id_shipment: id },
    data: {
      status: data.status,
      shipment_date: shipmentDate,
      actual_delivery_date: actualDeliveryDate,
    },
    include: { warehouse: true },
  });
};

// Just when order status: confirmed -> Cancelled
const deleteShipmentById = async (id) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id_shipment: id },
  });

  if (!shipment) {
    throw {
      status: 404,
      message: "Shipment not found",
    };
  }

  // && Just when order status is cancelled
  if (shipment.status !== "PENDING") {
    throw {
      status: 400,
      message: `A Shipment ${shipment.status} cannot be deleted`,
    };
  }

  return await prisma.shipment.delete({
    where: { id_shipment: id },
    include: { warehouse: true },
  });
};

module.exports = {
  getAllShipments,
  getShipmentsByStatus,
  getShipmentById,
  createShipment,
  updateShipmentById,
  deleteShipmentById,
};
