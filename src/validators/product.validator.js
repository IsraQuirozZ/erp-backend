const {
  validateStringField,
  validateDecimalField,
} = require("../utils/validators.utils");

const validateCreateProduct = async (req, res, next) => {
  if (req.body.id_product !== undefined) {
    return res
      .status(400)
      .json({ error: "The Product ID must be not provided" });
  }

  const { name, price, description, active, id_supplier_product } = req.body;

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
  } catch (error) {
    return next(error);
  }

  // ACTIVE (OPTIONAL, DEFAULT TRUE)
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  // ID_SUPPLIER
  if (!id_supplier_product || typeof id_supplier_product !== "number") {
    return res
      .status(400)
      .json({ error: "Supplier ID si required and must be a number" });
  }

  // NORMALIZE
  if (active === undefined) {
    req.body.active = true;
  }

  next();
};

const validateUpdateProduct = async (req, res, next) => {
  if (req.body.id_product !== undefined) {
    return res
      .status(400)
      .json({ error: "The Product ID must be not provided" });
  }

  if (req.body.id_supplier_product !== undefined) {
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

    // PRICE
    if (price !== undefined) {
      req.body.price = validateDecimalField(price, "Price");
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
module.exports = { validateCreateProduct, validateUpdateProduct };
