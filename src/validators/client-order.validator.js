const { OrderStatus } = require("@prisma/client");

const validateCreateClientOrder = async (req, res, next) => {
  if (req.body.id_client_order !== undefined) {
    return res
      .status(400)
      .json({ error: "Client Order ID must not be provided" });
  }

  if (
    req.body.status !== undefined ||
    req.body.total !== undefined ||
    req.body.created_at !== undefined ||
    req.body.updated_at !== undefined ||
    req.body.expected_delivery_date !== undefined
  ) {
    return res.status(400).json({
      error: "Some fields are managed automatically by the system",
    });
  }

  const { id_client } = req.body;

  // ID_CLIENT
  if (!id_client || typeof id_client !== "number") {
    return res.status(400).json({ error: "The Client ID must be a number" });
  }

  next();
};

const validateUpdateClientOrder = async (req, res, next) => {
  if (req.body.id_client_order !== undefined) {
    return res
      .status(400)
      .json({ error: "Client Order ID must be not provided" });
  }

  if (
    req.body.id_client !== undefined ||
    req.body.total !== undefined ||
    req.body.active !== undefined ||
    req.body.created_at !== undefined ||
    req.body.updated_at !== undefined ||
    req.body.expected_delivery_date !== undefined
  ) {
    return res.status(400).json({
      error: "Some fields cannot be updated",
    });
  }

  const { status } = req.body;

  if (status === undefined) {
    return res.status(400).json({
      error: "Status is required to update the order",
    });
  }

  // STATUS
  if (status !== undefined) {
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Status must be a string" });
    }

    const normalizedStatus = status.trim().toUpperCase();

    if (!Object.values(OrderStatus).includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid Client Order status" });
    }
    req.body.status = normalizedStatus;
  }

  next();
};

module.exports = { validateCreateClientOrder, validateUpdateClientOrder };
