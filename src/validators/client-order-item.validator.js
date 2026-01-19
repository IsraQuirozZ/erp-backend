const { onlyNumbersRegex } = require("../utils/regex.utils");
const { validateIntField } = require("../utils/validators.utils");

const validateCreateClientOrderItem = async (req, res, next) => {
  if (req.body.unit_price !== undefined || req.body.subtotal !== undefined) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { id_client_order, id_product, quantity } = req.body;

  try {
    // QUANTITY
    // TODO: Manage Stock
    req.body.quantity = validateIntField(quantity, "Quantity");

    // ID_CLIENT_ORDER
    req.body.id_client_order = validateIntField(
      id_client_order,
      "Client Order ID",
    );

    req.body.id_product = validateIntField(id_product, "Product ID");
  } catch (error) {
    return next(error);
  }

  next();
};

// Update just the field quantity
const validateUpdateClientOrderItem = async (req, res, next) => {
  if (
    req.body.id_client_order !== undefined ||
    req.body.id_product !== undefined ||
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
  validateCreateClientOrderItem,
  validateUpdateClientOrderItem,
};
