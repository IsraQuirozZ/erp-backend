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

// RECEIVED -> Update (status: DELIVERED)
// CANCELLED -> Updated (status: CANCELLED)

module.exports = {
  getAllShipments,
  getShipmentsByStatus,
  getShipmentById,
  createShipment,
};
