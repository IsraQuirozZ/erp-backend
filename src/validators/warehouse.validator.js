const { WarehouseType } = require("@prisma/client");

const {
  validateStringField,
  validateIntField,
} = require("../utils/validators.utils");

const validateCreateWarehouse = async (req, res, next) => {
  if (req.body.id_warehouse !== undefined) {
    return res
      .status(400)
      .json({ error: "The Warehouse ID must be not provided" });
  }

  const { name, warehouse_type, capacity, active, id_address } = req.body;

  try {
    // NAME
    req.body.name = validateStringField(name, "Warehouse Name");

    // CAPACITY
    req.body.capacity = validateIntField(capacity, "Capacity");
  } catch (error) {
    return next(error);
  }

  // WAREHOUSE_TYPE
  if (warehouse_type !== undefined) {
    if (typeof warehouse_type !== "string") {
      return res.status(400).json({ error: "Warehouse Type must be a string" });
    }

    const normalizedType = warehouse_type.trim().toUpperCase();

    if (!Object.values(WarehouseType).includes(normalizedType)) {
      return res.status(400).json({ error: "Invalid warehouse type" });
    }

    req.body.warehouse_type = normalizedType;
  }

  // ACTIVE (OPTIONAL, DEFAULT TRUE)
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  // ID_ADDRESS
  if (!id_address || typeof id_address !== "number") {
    return res
      .status(400)
      .json({ error: "Address ID is required and must be a number" });
  }

  if (active === undefined) {
    req.body.active = true;
  }

  next();
};

const validateUpdateWarehouse = async (req, res, next) => {
  if (req.body.id_warehouse !== undefined) {
    return res
      .status(400)
      .json({ error: "The Warehouse ID must be not provided" });
  }

  if (req.body.id_address !== undefined) {
    return res.status(400).json({ error: "The Address ID can not be updated" });
  }

  const { name, warehouse_type, capacity, active } = req.body;

  if (
    name === undefined &&
    warehouse_type === undefined &&
    capacity === undefined &&
    active === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the warehouse",
    });
  }

  try {
    // NAME
    if (name !== undefined) {
      req.body.name = validateStringField(name, "Warehouse Name");
    }

    // CAPACITY
    if (capacity !== undefined) {
      req.body.capacity = validateIntField(capacity, "Capacity");
    }
  } catch (error) {
    return next(error);
  }

  // WAREHOUSE_TYPE
  if (warehouse_type !== undefined) {
    if (typeof warehouse_type !== "string") {
      return res.status(400).json({ error: "Warehouse Type must be a string" });
    }

    const normalizedType = warehouse_type.trim().toUpperCase();

    if (!Object.values(WarehouseType).includes(normalizedType)) {
      return res.status(400).json({ error: "Invalid Warehouse Type" });
    }

    req.body.warehouse_type = normalizedType;
  }

  // ACTIVE
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }
  next();
};

module.exports = { validateCreateWarehouse, validateUpdateWarehouse };
