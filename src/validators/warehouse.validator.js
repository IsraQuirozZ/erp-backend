const { WarehouseType } = require("@prisma/client");

const {
  validateStringField,
  validateIntField,
} = require("../utils/validators.utils");

const validateCreateWarehouse = async (req, res, next) => {
  const { province, address, warehouse } = req.body;

  if (!province || !address || !warehouse) {
    return res
      .status(400)
      .json({ error: "Warehouse, Address and Province are required" });
  }

  if (
    province.id_province !== undefined ||
    address.id_address !== undefined ||
    warehouse.id_warehouse !== undefined
  ) {
    return res.status(400).json({ error: "IDs must not be provided" });
  }

  try {
    // WAREHOUSE
    // NAME
    warehouse.name = validateStringField(warehouse.name, "Warehouse Name");

    // CAPACITY
    warehouse.capacity = validateIntField(warehouse.capacity, "Capacity");

    // WAREHOUSE_TYPE -> "MAIN", "SECONDARY", "DISTRIBUTION", "STORE"
    if (warehouse.warehouse_type !== undefined) {
      warehouse.warehouse_type = validateStringField(
        warehouse.warehouse_type,
        "Warehouse Type",
        { onlyLetters: true },
      );

      const normalizedType = warehouse.warehouse_type.toUpperCase();
      if (!Object.values(WarehouseType).includes(normalizedType)) {
        return res.status(400).json({ error: "Invalid Warehouse Type" });
      }
      warehouse.warehouse_type = normalizedType;
    } else {
      warehouse.warehouse_type = "MAIN";
    }

    // ACTIVE
    if (
      warehouse.active !== undefined &&
      typeof warehouse.active !== "boolean"
    ) {
      return res.status(400).json({ error: "Active must be a boolean value" });
    }
    if (warehouse.active === undefined) {
      warehouse.active = true;
    }

    // -- ADDRESS --
    address.street = validateStringField(address.street, "Street");
    address.number = validateStringField(address.number, "St. Number");
    address.portal = validateStringField(address.portal, "Portal", {
      required: false,
    });
    address.floor = validateStringField(address.floor, "Floor", {
      required: false,
    });
    address.door = validateStringField(address.door, "Door", {
      required: false,
    });
    address.municipality = validateStringField(
      address.municipality,
      "Municipality",
      { onlyLetters: true },
    );

    // POSTAL
    if (
      !address.postal_code ||
      typeof address.postal_code !== "string" ||
      address.postal_code.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ error: "The postal code must be a non-empty string" });
    }
    if (!/^[0-9]{5}$/.test(address.postal_code.trim())) {
      return res
        .status(400)
        .json({ error: "The postal code must have 5 digits" });
    }
    address.postal_code = address.postal_code.trim();

    // PROVINCE
    province.name = validateStringField(province.name, "Province Name", {
      onlyLetters: true,
    });
  } catch (error) {
    return next(error);
  }
  next();
};

const validateUpdateWarehouse = async (req, res, next) => {
  const { warehouse, address, province } = req.body;

  if (!warehouse && !address && !province) {
    return res.status(400).json({
      error:
        "At least one of warehouse, address, or province must be provided to update the warehouse",
    });
  }

  if (warehouse && warehouse.id_warehouse !== undefined) {
    return res
      .status(400)
      .json({ error: "The Warehouse ID must not be provided" });
  }
  if (address && address.id_address !== undefined) {
    return res.status(400).json({ error: "The Address ID can not be updated" });
  }
  if (province && province.id_province !== undefined) {
    return res
      .status(400)
      .json({ error: "The Province ID can not be updated" });
  }

  try {
    // WAREHOUSE
    if (warehouse) {
      // NAME
      if (warehouse.name !== undefined) {
        warehouse.name = validateStringField(warehouse.name, "Warehouse Name");
      }
      // CAPACITY
      if (warehouse.capacity !== undefined) {
        warehouse.capacity = validateIntField(warehouse.capacity, "Capacity");
      }
      // WAREHOUSE_TYPE
      if (warehouse.warehouse_type !== undefined) {
        warehouse.warehouse_type = validateStringField(
          warehouse.warehouse_type,
          "Warehouse Type",
          { onlyLetters: true },
        );
        const normalizedType = warehouse.warehouse_type.toUpperCase();
        if (!Object.values(WarehouseType).includes(normalizedType)) {
          return res.status(400).json({ error: "Invalid Warehouse Type" });
        }
        warehouse.warehouse_type = normalizedType;
      }
      // ACTIVE
      if (
        warehouse.active !== undefined &&
        typeof warehouse.active !== "boolean"
      ) {
        return res
          .status(400)
          .json({ error: "Active must be a boolean value" });
      }
    }

    // ADDRESS
    if (address) {
      if (address.street !== undefined) {
        address.street = validateStringField(address.street, "Street");
      }
      if (address.number !== undefined) {
        address.number = validateStringField(address.number, "St. Number");
      }
      if (address.portal !== undefined) {
        address.portal = validateStringField(address.portal, "Portal", {
          required: false,
        });
      }
      if (address.floor !== undefined) {
        address.floor = validateStringField(address.floor, "Floor", {
          required: false,
        });
      }
      if (address.door !== undefined) {
        address.door = validateStringField(address.door, "Door", {
          required: false,
        });
      }
      if (address.municipality !== undefined) {
        address.municipality = validateStringField(
          address.municipality,
          "Municipality",
          { onlyLetters: true },
        );
      }
      if (address.postal_code !== undefined) {
        if (
          typeof address.postal_code !== "string" ||
          address.postal_code.trim().length === 0
        ) {
          return res
            .status(400)
            .json({ error: "The postal code must be a non-empty string" });
        }
        if (!/^[0-9]{5}$/.test(address.postal_code.trim())) {
          return res
            .status(400)
            .json({ error: "The postal code must have 5 digits" });
        }
        address.postal_code = address.postal_code.trim();
      }
    }

    // PROVINCE
    if (province && province.name !== undefined) {
      province.name = validateStringField(province.name, "Province Name", {
        onlyLetters: true,
      });
    }
  } catch (error) {
    return next(error);
  }
  next();
};

module.exports = { validateCreateWarehouse, validateUpdateWarehouse };
