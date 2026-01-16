const { validateIntField } = require("../utils/validators.utils");

const validateCreateSupplierproductInventory = async (req, res, next) => {
  const {
    id_supplier_product,
    id_warehouse,
    current_stock,
    max_stock,
    min_stock,
    last_updated,
    active,
  } = req.body;

  try {
    // ID_SUPPLIER_PRODUCT
    req.body.id_supplier_product = validateIntField(
      id_supplier_product,
      "Supplier Product ID"
    );

    // ID_WAREHOUSE
    req.body.id_warehouse = validateIntField(id_warehouse, "Warehouse ID");

    // CURRENT_STOCK
    req.body.current_stock = validateIntField(current_stock, "Current Stock");

    // MAX_STOCK
    req.body.max_stock = validateIntField(max_stock, "MAX Stock");

    // MIN_STOCK
    req.body.min_stock = validateIntField(min_stock, "MIN Stock");

    // BASIC COHERENCE
    if (req.body.min_stock > req.body.max_stock) {
      return res
        .status(400)
        .json({ error: "Min stock cannot be greater than max stock" });
    }

    if (
      req.body.current_stock < req.body.min_stock ||
      req.body.current_stock > req.body.max_stock
    ) {
      return res
        .status(400)
        .json({ error: "Current Stock must be between min and max stock" });
    }
  } catch (error) {
    return next(error);
  }

  next();
};

module.exports = { validateCreateSupplierproductInventory };
