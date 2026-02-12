const { InvoiceStatus } = require("@prisma/client");

const validateCreateSupplierInvoice = (req, res, next) => {
  const { id_supplier_order } = req.body;

  if (id_supplier_order === undefined) {
    return res
      .status(400)
      .json({ error: "The Supplier Order ID must be provided" });
  }
  if (typeof id_supplier_order !== "number") {
    return res
      .status(400)
      .json({ error: "The Supplier Order ID must be a number" });
  }
  next();
};

const validateUpdateSupplierInvoice = (req, res, next) => {
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

  if (!Object.values(InvoiceStatus).includes(normalizedStatus)) {
    return res.status(400).json({
      error: "Invalid supplier order status",
    });
  }

  req.body.status = normalizedStatus;

  next();
};

module.exports = {
  validateCreateSupplierInvoice,
  validateUpdateSupplierInvoice,
};
