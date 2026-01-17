const { validateIntField } = require("../utils/validators.utils");

const validateCreateProductInventory = async (req, res, next) => {
  const {
    id_product,
    id_warehouse,
    current_stock,
    max_stock,
    min_stock,
    active,
  } = req.body;

  try {
    // ID_PRODUCT
    req.body.id_product = validateIntField(id_product, "Product ID");

    // ID_WAREHOUSE
    req.body.id_warehouse = validateIntField(id_warehouse, "Warehouse ID");

    // CURRENT_STOCK
    req.body.current_stock = validateIntField(current_stock, "Current Stock");

    // MAX_STOCK
    req.body.max_stock = validateIntField(max_stock, "MAX Stock");

    // MIN_STOCK
    req.body.min_stock = validateIntField(min_stock, "MIN Stock");

    // ACTIVE (OPTIONAL, DEFAULT TRUE)
    if (active !== undefined && typeof active !== "boolean") {
      return res.status(400).json({ error: "Active must be a boolean value" });
    }

    if (active === undefined) {
      req.body.active = true;
    }

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

const validateUpdateProductInventory = async (req, res, next) => {
  if (
    req.body.id_product !== undefined ||
    req.body.id_warehouse !== undefined
  ) {
    return res.status(400).json({
      error: "Product Inventory ID cannot be updated",
    });
  }

  if (
    req.body.current_stock !== undefined ||
    req.body.last_updated !== undefined
  ) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { max_stock, min_stock, active } = req.body;

  if (
    max_stock === undefined &&
    min_stock === undefined &&
    active === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the inevtory",
    });
  }

  try {
    // MAX_STOCK
    if (max_stock !== undefined) {
      req.body.max_stock = validateIntField(max_stock, "Max Stock");
    }

    // MIN_STOCK
    if (min_stock !== undefined) {
      req.body.min_stock = validateIntField(min_stock, "Min Stock");
    }
  } catch (error) {
    return next(error);
  }

  // BASIC COHERENCE
  if (
    req.body.min_stock !== undefined &&
    req.body.max_stock !== undefined &&
    req.body.min_stock > req.body.max_stock
  ) {
    return res
      .status(400)
      .json({ error: "Min stock cannot be greater than max stock" });
  }

  // ACTIVE
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  if (active === false) {
    return res.status(400).json({ error: "Active cannot be updated to false" });
  }
  next();
};

module.exports = {
  validateCreateProductInventory,
  validateUpdateProductInventory,
};
