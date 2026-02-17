const { validateIntField } = require("../utils/validators.utils");

const validateCreateProductComponent = (req, res, next) => {
  const { id_product, id_component, quantity } = req.body;

  if (!id_product || !id_component || !quantity) {
    return res.status(400).json({
      message: "Missing required fields: id_product, id_component, quantity",
    });
  }

  try {
    // ID_PRODUCT
    req.body.id_product = validateIntField(id_product, "Product ID");

    // ID_COMPONENT
    req.body.id_component = validateIntField(id_component, "Component ID");

    // QUANTITY
    req.body.quantity = validateIntField(quantity, "Quantity");
  } catch (error) {
    next(error);
  }

  next();
};

module.exports = {
  validateCreateProductComponent,
};
