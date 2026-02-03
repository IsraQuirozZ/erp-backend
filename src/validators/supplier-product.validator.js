const {
  validateDecimalField,
  validateStringField,
  validateIntField,
} = require("../utils/validators.utils");

const validateCreateSupplierProduct = async (req, res, next) => {
  if (req.body.id_supplier_product) {
    return res
      .status(400)
      .json({ error: "Supplier Product ID must not be provided" });
  }

  const { name, price, description, active, id_supplier } = req.body;

  try {
    // NAME
    req.body.name = validateStringField(name, "Name");

    // PRICE
    req.body.price = validateDecimalField(price, "Price");

    // DESCRIPTION -> OPTIONAL
    req.body.description = validateStringField(description, "Description", {
      required: false,
      capitalizeFirst: true,
    });

    // ID_SUPPLIER
    req.body.id_supplier = validateIntField(id_supplier, "Supplier ID");
  } catch (error) {
    return next(error);
  }

  // ACTIVE (OPTIONAL, DEFAULT TRUE)
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  // NORMALIZE
  if (active === undefined) {
    req.body.active = true;
  }

  next();
};

const validateUpdateSupplierProduct = async (req, res, next) => {
  if (req.body.id_supplier_product) {
    return res
      .status(400)
      .json({ error: "Supplier Product ID must not be provided" });
  }

  if (req.body.id_supplier !== undefined) {
    return res.status(400).json({ error: "The supplier can not be updated" });
  }

  const { name, price, description, active } = req.body;

  if (
    name === undefined &&
    price === undefined &&
    description === undefined &&
    active === undefined
  ) {
    return res.status(400).json({
      error:
        "At least one field must be provided to update the supplier product",
    });
  }

  try {
    // NAME
    if (name !== undefined) {
      req.body.name = validateStringField(name, "Name");
    }

    // PURCHASE_PRICES
    if (price !== undefined) {
      req.body.price = validateDecimalField(price, "Purchase Price");
    }

    // DESCRIPTION
    if (description !== undefined) {
      req.body.description = validateStringField(description, "Description", {
        required: false,
        capitalizeFirst: true,
      });
    }
  } catch (error) {
    return next(error);
  }

  // ACTIVE (OPTIONAL, DEFAULT TRUE)
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  next();
};

module.exports = {
  validateCreateSupplierProduct,
  validateUpdateSupplierProduct,
};
