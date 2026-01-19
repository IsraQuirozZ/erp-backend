const { onlyNumbersRegex } = require("../utils/regex.utils");
const validateCreateSupplierOrderitem = async (req, res, next) => {
  if (req.body.id_supplier_order_item !== undefined) {
    return res
      .status(400)
      .json({ error: "Supplier Order Item ID must be not provided" });
  }

  if (req.body.unit_price !== undefined || req.body.subtotal !== undefined) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { id_supplier_order, id_supplier_product, quantity } = req.body;

  // QUANTITY
  // TODO: Manage Stock
  if (
    !quantity ||
    typeof quantity !== "string" ||
    quantity.trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Quantity must be a non-empty string" });
  }

  if (!onlyNumbersRegex.test(quantity.trim())) {
    return res.status(400).json({ error: "Quantity must contain only digits" });
  }

  if (parseInt(quantity.trim()) <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive number" });
  }

  // NORMALIZE
  req.body.quantity = parseInt(quantity.trim());

  // ID_SUPPLIER_ORDER
  if (!id_supplier_order || typeof id_supplier_order !== "number") {
    return res
      .status(400)
      .json({ error: "The Supplier Order ID must be a number" });
  }

  // ID_SUPPLIER_PRODUCT
  if (!id_supplier_product || typeof id_supplier_product !== "number") {
    return res
      .status(400)
      .json({ error: "The Supplier Product ID must be a number" });
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
  validateCreateSupplierOrderitem,
  validateUpdateSupplierOrderItem,
};
