const { ShipmentStatus } = require("@prisma/client");
const {
  validateStringField,
  validateDecimalField,
  validateIntField,
} = require("../utils/validators.utils");

const validateCreateShipment = async (req, res, next) => {
  if (req.body.id_shipment !== undefined) {
    return res.status(400).json({ error: "Shipment ID must be not provided" });
  }

  if (
    req.body.status !== undefined ||
    req.body.shipment_date !== undefined ||
    req.body.estimated_delivery_date !== undefined ||
    req.body.actual_delivery_date !== undefined
  ) {
    return res
      .status(400)
      .json({ error: "Some fields are managed automatically by the system" });
  }

  const { shipping_company, shipping_cost, id_warehouse } = req.body;

  try {
    // SHIPPING_COMPANY
    req.body.shipping_company = validateStringField(
      shipping_company,
      "Shipping Company",
    );

    // SHIPPING_COST
    req.body.shipping_cost = validateDecimalField(
      shipping_cost,
      "Shipping Cost",
    );

    // ID_WAREHOUSE
    req.body.id_warehouse = validateIntField(id_warehouse, "Warehouse ID");
  } catch (error) {
    return next(error);
  }
  next();
};

const validateUpdateShipment = async (req, res, next) => {
  if (req.body.id_shipment !== undefined) {
    return res.status(400).json({ error: "Shipment ID must not be provided" });
  }

  if (
    req.body.shipping_company !== undefined ||
    req.body.shipping_cost !== undefined ||
    req.body.shipment_date !== undefined ||
    req.body.estimated_delivery_date !== undefined ||
    req.body.actual_delivery_date !== undefined
  ) {
    return res
      .status(400)
      .json({ error: "Some fields cannot be updated manually" });
  }

  const { status } = req.body;

  if (status === undefined) {
    return res
      .status(400)
      .json({ error: "Status must be provided to update the shipment" });
  }

  if (status !== undefined) {
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Status must be a string" });
    }

    const normalizedStatus = status.trim().toUpperCase();

    if (!Object.values(ShipmentStatus).includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid shipment status" });
    }
    req.body.status = normalizedStatus;
  }
  next();
};

module.exports = { validateCreateShipment, validateUpdateShipment };
