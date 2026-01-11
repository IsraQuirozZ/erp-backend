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
  if (
    !quantity ||
    typeof quantity !== "string" ||
    quantity.trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Quantity must be a non-empty string" });
  }

  // Future -> Manage Stock
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

module.exports = { validateCreateSupplierOrderitem };
