const { SupplierOrderStatus } = require("@prisma/client");

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
  if (req.body.id_supplier_order !== undefined) {
    return res
      .status(400)
      .json({ error: "Supplier Order ID must be not provided" });
  }

  if (
    req.body.id_supplier !== undefined ||
    req.body.total !== undefined ||
    req.body.active !== undefined ||
    req.body.created_at !== undefined ||
    req.body.updated_at !== undefined
  ) {
    return res.status(400).json({
      error: "Some fields cannot be updated",
    });
  }

  const { expected_delivery_date, status } = req.body;

  if (expected_delivery_date === undefined && status === undefined) {
    return res.status(400).json({
      error: "At least one field must be provided to update the order",
    });
  }

  // EXPECTED_DELIVERY_DATE
  if (expected_delivery_date !== undefined) {
    if (typeof expected_delivery_date !== "string") {
      return res
        .status(400)
        .json({ error: "Expected delivery date must be a non-empty string" });
    }

    const parsedDate = new Date(expected_delivery_date.trim());

    if (isNaN(parsedDate.getTime())) {
      return res
        .status(400)
        .json({ error: "Expected delivery date must be a valid date" });
    }

    const now = new Date();
    if (parsedDate.getTime() < now.getTime()) {
      return res.status(400).json({
        error: "Expected delivery date cannot be in the past",
      });
    }

    req.body.expected_delivery_date = parsedDate;
  }

  // STATUS
  if (status !== undefined) {
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Status must be a string" });
    }

    const normalizedStatus = status.trim().toUpperCase();

    if (!Object.values(SupplierOrderStatus).includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid supplier order status" });
    }
    req.body.status = normalizedStatus;
  }

  next();
};

module.exports = { validateCreateSupplierOrder, validateUpdateSupplierOrder };
