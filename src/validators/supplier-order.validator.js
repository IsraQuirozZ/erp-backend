const validateCreateSupplierOrder = async (req, res, next) => {
  if (req.body.id_supplier_order !== undefined) {
    return res
      .status(400)
      .json({ error: "Supplier Order ID must be not provided" });
  }

  if (
    req.body.status !== undefined ||
    req.body.total !== undefined ||
    req.body.active !== undefined ||
    req.body.created_at !== undefined ||
    req.body.updated_at !== undefined ||
    req.body.expected_delivery_date !== undefined
  ) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { id_supplier } = req.body;

  // ID_SUPPLIER
  if (!id_supplier || typeof id_supplier !== "number") {
    return res.status(400).json({ error: "The Supplier ID must be a number" });
  }

  next();
};

const validateUpdateSupplierOrder = async (req, res, next) => {
  next();
};

module.exports = { validateCreateSupplierOrder };
