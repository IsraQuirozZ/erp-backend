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
      "Shipping Company"
    );

    // SHIPPING_COST
    req.body.shipping_cost = validateDecimalField(
      shipping_cost,
      "Shipping Cost"
    );

    // ID_WAREHOUSE
    req.body.id_warehouse = validateIntField(id_warehouse, "Warehouse ID");
  } catch (error) {
    return next(error);
  }
  next();
};

module.exports = { validateCreateShipment };
