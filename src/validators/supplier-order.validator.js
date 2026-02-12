const { OrderStatus } = require("@prisma/client");

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

  const { id_supplier, id_warehouse } = req.body;

  // ID_SUPPLIER
  if (!id_supplier || typeof id_supplier !== "number") {
    return res.status(400).json({ error: "The Supplier ID must be a number" });
  }

  // ID_WAREHOUSE
  if (!id_warehouse || typeof id_warehouse !== "number") {
    return res.status(400).json({ error: "The Warehouse ID must be a number" });
  }
  next();
};

const validateUpdateSupplierOrder = async (req, res, next) => {
  const { status } = req.body;

  // ONLY STATUS
  if (Object.keys(req.body).length !== 1 || status === undefined) {
    return res.status(400).json({
      error: "Only 'status' field is allowed",
    });
  }

  if (typeof status !== "string") {
    return res.status(400).json({
      error: "Status must be a string",
    });
  }

  const normalizedStatus = status.trim().toUpperCase();

  if (!Object.values(OrderStatus).includes(normalizedStatus)) {
    return res.status(400).json({
      error: "Invalid supplier order status",
    });
  }

  req.body.status = normalizedStatus;

  next();
};

module.exports = { validateCreateSupplierOrder, validateUpdateSupplierOrder };
