const { InvoiceStatus } = require("@prisma/client");

const validateUpdateClientInvoice = (req, res, next) => {
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
      error: "Invalid client invoice status",
    });
  }

  req.body.status = normalizedStatus;

  next();
};

module.exports = {
  validateUpdateClientInvoice,
};
