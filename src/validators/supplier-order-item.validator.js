const {
  validateIntField,
  validateDecimalField,
} = require("../utils/validators.utils");
const validateCreateSupplierOrderItem = async (req, res, next) => {
  if (req.body.subtotal !== undefined || req.body.unit_price !== undefined) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { id_supplier_order, id_component, quantity, tax, discount } = req.body;

  try {
    // ID_SUPPLIER_ORDER
    req.body.id_supplier_order = validateIntField(
      id_supplier_order,
      "Supplier Order ID",
    );

    // ID_COMPONENT
    req.body.id_component = validateIntField(id_component, "Component ID");

    // QUANTITY
    req.body.quantity = validateIntField(quantity, "Quantity");

    // TAXES (optional)
    if (tax !== undefined) {
      req.body.tax = Number(tax);
    }

    // DISCOUNTS (optional)
    if (discount !== undefined) {
      req.body.discount = Number(discount);
    }
  } catch (error) {
    return next(error);
  }
  next();
};

// Update just the field quantity
// TODO: Update if Products are updated && Order: PENDING -> in productService
const validateUpdateSupplierOrderItem = async (req, res, next) => {
  if (req.body.id_supplier_order_item !== undefined) {
    return res
      .status(400)
      .json({ error: "Supplier Order Item ID must not be provided" });
  }

  if (
    req.body.id_supplier_order !== undefined ||
    req.body.id_supplier_product !== undefined ||
    req.body.unit_price !== undefined ||
    req.body.subtotal !== undefined
  ) {
    return res.status(400).json({
      error: "Only quantity can be updated for order items",
    });
  }

  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({
      error: "Quantity field must be provided to update the order item",
    });
  }

  try {
    req.body.quantity = validateIntField(quantity, "Quantity");
  } catch (error) {
    return next(error);
  }

  next();
};

module.exports = {
  validateCreateSupplierOrderItem,
  validateUpdateSupplierOrderItem,
};
