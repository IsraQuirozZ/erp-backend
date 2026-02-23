const { validateIntField } = require("../utils/validators.utils");
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

// UPDATE VALIDATOR
const validateUpdateSupplierOrderItem = async (req, res, next) => {
  if (req.body.unit_price !== undefined || req.body.subtotal !== undefined) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }
  const { quantity, tax, discount } = req.body;

  if (quantity === undefined && tax === undefined && discount === undefined) {
    return res.status(400).json({
      error:
        "At least one field (quantity, tax, discount) must be provided for update",
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
        return res.status(400).json({
          error: "Tax must be a number between 0 and 100",
        });
      }
      req.body.tax = t;
    }

    // DISCOUNT (optional, 0–100)
    if (discount !== undefined) {
      const d = Number(discount);
      if (Number.isNaN(d) || d < 0 || d > 100) {
        return res.status(400).json({
          error: "Discount must be a number between 0 and 100",
        });
      }
      req.body.discount = d;
    }
  } catch (error) {
    return next(error);
  }

  next();
};

module.exports = {
  validateCreateSupplierOrderItem,
  validateUpdateSupplierOrderItem,
};
