const { validateIntField } = require("../utils/validators.utils");
const validateCreateClientOrderItem = async (req, res, next) => {
  if (req.body.unit_price !== undefined || req.body.subtotal !== undefined) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { id_client_order, id_product, quantity, tax, discount } = req.body;

  try {
    // ID_CLIENT_ORDER
    req.body.id_client_order = validateIntField(
      id_client_order,
      "Client Order ID",
    );

    // ID_PRODUCT
    req.body.id_product = validateIntField(id_product, "Product ID");

    // QUANTITY
    req.body.quantity = validateIntField(quantity, "Quantity");

    // TAXES
    if (tax !== undefined) {
      const t = Number(tax);
      if (Number.isNaN(t) || t < 0 || t > 100) {
        throw {
          status: 400,
          message: "Taxes must be a number between 0 and 100",
        };
      }
      req.body.tax = t;
    }

    // DISCOUNTS
    if (discount !== undefined) {
      const d = Number(discount);
      if (Number.isNaN(d) || d < 0 || d > 100) {
        throw {
          status: 400,
          message: "Discounts must be a number between 0 and 100",
        };
      }
      req.body.discount = d;
    }
  } catch (error) {
    return next(error);
  }

  next();
};

// UPDATE
const validateUpdateClientOrderItem = async (req, res, next) => {
  if (req.body.unit_price !== undefined || req.body.subtotal !== undefined) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { quantity, tax, discount } = req.body;

  if (quantity === undefined && tax === undefined && discount === undefined) {
    return res.status(400).json({
      error:
        "At least one field (quantity, tax, discount) must be provided to update the order item",
    });
  }

  try {
    // QUANTITY
    if (quantity !== undefined) {
      req.body.quantity = validateIntField(quantity, "Quantity");
    }

    // TAX (optional, 0–100)
    if (tax !== undefined) {
      const t = Number(tax);
      if (Number.isNaN(t) || t < 0 || t > 100) {
        throw {
          status: 400,
          message: "Taxes must be a number between 0 and 100",
        };
      }
      req.body.tax = t;
    }

    // DISCOUNT (optional, 0–100)
    if (discount !== undefined) {
      const d = Number(discount);
      if (Number.isNaN(d) || d < 0 || d > 100) {
        throw {
          status: 400,
          message: "Discounts must be a number between 0 and 100",
        };
      }
      req.body.discount = d;
    }
  } catch (error) {
    return next(error);
  }

  next();
};

module.exports = {
  validateCreateClientOrderItem,
  validateUpdateClientOrderItem,
};
