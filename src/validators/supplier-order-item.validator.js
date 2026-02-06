const {
  validateIntField,
  validateDecimalField,
} = require("../utils/validators.utils");
const validateCreateSupplierOrderitem = async (req, res, next) => {
  if (req.body.id_supplier_order_item !== undefined) {
    return res
      .status(400)
      .json({ error: "Supplier Order Item ID must not be provided" });
  }

  if (req.body.subtotal !== undefined) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const {
    id_supplier_order,
    id_component,
    id_supplier,
    quantity,
    unit_price,
    taxes,
    discounts,
    component_name,
  } = req.body;

  try {
    // ID_SUPPLIER_ORDER (optional)
    if (id_supplier_order !== undefined) {
      req.body.id_supplier_order = validateIntField(
        id_supplier_order,
        "Supplier Order ID",
      );
    }

    // ID_COMPONENT
    req.body.id_component = validateIntField(id_component, "Component ID");

    // ID_SUPPLIER (mandatory if !id_supplier_order)
    if (!id_supplier_order) {
      req.body.id_supplier = validateIntField(id_supplier, "Supplier ID");
    }

    // QUANTITY
    req.body.quantity = validateIntField(quantity, "Quantity");

    // UNIT_PRICE (required if component does not exist)
    if (!id_component && !unit_price) {
      return res.status(400).json({
        error: "Unit Price is required if the component does not exist",
      });
    }

    if (unit_price !== undefined) {
      req.body.unit_price = validateDecimalField(unit_price, "Unit Price");
    }

    // COMPONENT_NAME (required if component does not exist)
    if (!id_component && !component_name) {
      return res.status(400).json({
        error: "Component name is required if the component does not exist",
      });
    }

    // TAXES (optional)
    if (taxes !== undefined) {
      req.body.taxes = validateDecimalField(taxes, "Taxes", {
        required: false,
      });
    }
    // DISCOUNTS (optional)
    if (discounts !== undefined) {
      req.body.discounts = validateDecimalField(discounts, "Discounts", {
        required: false,
      });
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
  validateCreateSupplierOrderitem,
  validateUpdateSupplierOrderItem,
};
