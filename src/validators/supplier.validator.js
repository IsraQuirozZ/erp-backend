const { phoneRegex, emailRegex } = require("../utils/regex.utils");
const { validateStringField } = require("../utils/validators.utils");

const validateCreateSupplier = (req, res, next) => {
  if (req.body.id_supplier !== undefined) {
    return res.status(400).json({ error: "Supplier ID must be not provided" });
  }

  const { name, phone, email, id_address, active } = req.body || {};

  const normalizedPhone = phone?.trim();
  const normalizedEmail = email?.trim();

  try {
    // NAME
    req.body.name = validateStringField(name, "Name", { onlyLetters: true });
  } catch (error) {
    return next(error);
  }

  // PHONE
  if (
    !phone ||
    typeof phone !== "string" ||
    !phoneRegex.test(normalizedPhone)
  ) {
    return res.status(400).json({
      error: "The phone number must have 9 digits",
    });
  }

  // EMAIL
  if (
    !email ||
    typeof email !== "string" ||
    !emailRegex.test(normalizedEmail)
  ) {
    return res.status(400).json({
      error: "Email must be a valid email address",
    });
  }

  // ACTIVE
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  // ID_ADDRESS
  if (!id_address || typeof id_address !== "number") {
    return res.status(400).json({ error: "The address ID must be a number" });
  }

  // NORMALIZE
  req.body.phone = normalizedPhone.toLowerCase();
  req.body.email = normalizedEmail;
  if (active === undefined) {
    req.body.active = true;
  }

  next();
};

const validateUpdateSupplier = (req, res, next) => {
  if (req.body.id_supplier !== undefined) {
    return res.status(400).json({ error: "Supplier ID must be not provided" });
  }

  const { name, phone, email, id_address, active } = req.body;

  const normalizedPhone = phone?.trim();
  const normalizedEmail = email?.trim();

  if (
    name === undefined &&
    normalizedPhone === undefined &&
    normalizedEmail === undefined &&
    id_address === undefined &&
    active === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the supplier",
    });
  }

  // NAME
  try {
    // NAME
    if (name !== undefined) {
      req.body.name = validateStringField(name, "Name", { onlyLetters: true });
    }
  } catch (error) {
    return next(error);
  }

  // PHONE
  if (normalizedPhone !== undefined) {
    if (
      typeof normalizedPhone !== "string" ||
      !phoneRegex.test(normalizedPhone)
    ) {
      return res.status(400).json({
        error: "The phone number must have 9 digits",
      });
    }
    req.body.phone = normalizedPhone;
  }

  // EMAIL
  if (normalizedEmail !== undefined) {
    if (
      typeof normalizedEmail !== "string" ||
      !emailRegex.test(normalizedEmail)
    ) {
      return res.status(400).json({
        error: "Email must be a valid email address",
      });
    }
    req.body.email = normalizedEmail.toLowerCase();
  }

  // ID_ADDRESS
  if (id_address !== undefined && typeof id_address !== "number") {
    return res.status(400).json({ error: "The address ID must be a number" });
  }

  // ACTIVE (OPTIONAL, DEFAULT TRUE)
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  next();
};

// USE CASE
const validateCreateFullSupplier = (req, res, next) => {
  const { province, address, supplier } = req.body;

  if (!province || !address || !supplier) {
    return res
      .status(400)
      .json({ error: "Supplier, Address and Province are required" });
  }

  if (
    province.id_province !== undefined ||
    address.id_address !== undefined ||
    supplier.id_supplier !== undefined
  ) {
    return res.status(400).json({
      error: "ID's must not be provided",
    });
  }

  try {
    // SUPPLIER
    // NAME
    supplier.name = validateStringField(supplier.name, "Name");

    // PHONE
    if (
      !supplier.phone ||
      typeof supplier.phone !== "string" ||
      !phoneRegex.test(supplier.phone.trim())
    ) {
      return res.status(400).json({
        error: "The phone number must have 9 digits",
      });
    }

    // EMAIL
    if (
      !supplier.email ||
      typeof supplier.email !== "string" ||
      !emailRegex.test(supplier.email.trim())
    ) {
      return res.status(400).json({
        error: "Email must be a valid email address",
      });
    }

    // ACTIVE
    if (supplier.active !== undefined && typeof supplier.active !== "boolean") {
      return res.status(400).json({ error: "Active must be a boolean value" });
    }

    // NORMALIZE
    supplier.phone = supplier.phone.trim();
    supplier.email = supplier.email.trim().toLowerCase();
    if (supplier.active === undefined) {
      supplier.active = true;
    }

    // -- ADDRESS --
    // STREET
    address.street = validateStringField(address.street, "Street");

    // NUMBER
    address.number = validateStringField(address.number, "St. Number");

    // PORTAL -> OPTIONAL
    address.portal = validateStringField(address.portal, "Portal", {
      required: false,
    });

    // FLOOR -> OPTIONAL
    address.floor = validateStringField(address.floor, "Floor", {
      required: false,
    });

    // DOOR -> OPTIONAL
    address.door = validateStringField(address.door, "Door", {
      required: false,
    });

    // MUNICIPALITY
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
      return res.status(400).json({
        error: "The postal code must be a non-empty string",
      });
    }

    if (!/^[0-9]{5}$/.test(address.postal_code.trim())) {
      return res.status(400).json({
        error: "The postal code must have 5 digits",
      });
    }

    //  NORMALIZE
    address.postal_code = address.postal_code.trim();

    // POVINCE
    province.name = validateStringField(province.name, "Name", {
      onlyLetters: true,
    });
  } catch (error) {
    return next(error);
  }
  next();
};

module.exports = {
  validateCreateSupplier,
  validateUpdateSupplier,
  validateCreateFullSupplier,
};
