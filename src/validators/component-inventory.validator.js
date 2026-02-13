const { validateIntField } = require("../utils/validators.utils");
const validateUpdateComponentInventory = async (req, res, next) => {
  const { min_stock, max_stock } = req.body;

  const allowedFields = ["min_stock", "max_stock"];
  const bodyKeys = Object.keys(req.body);
  const invalidFields = bodyKeys.some((key) => !allowedFields.includes(key));

  if (invalidFields) {
    return res.status(400).json({
      error: "Only 'min_stock' & 'max_stock' fields are allowed",
    });
  }

  if (min_stock === undefined && max_stock === undefined) {
    return res.status(400).json({
      error: "At least one field must be provided to update the inventory",
    });
  }

  if (min_stock !== undefined) {
    req.body.min_stock = validateIntField(min_stock, "Min Stock");
  }

  if (max_stock !== undefined) {
    req.body.max_stock = validateIntField(max_stock, "Max Stock");
  }

  if (
    req.body.min_stock !== undefined &&
    req.body.max_stock !== undefined &&
    req.body.min_stock > req.body.max_stock
  ) {
    return res.status(400).json({
      error: "Minimum stock cannot be greater than maximum stock",
    });
  }
  next();
};

module.exports = {
  validateUpdateComponentInventory,
};
