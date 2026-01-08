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

module.exports = {
  validateCreateSupplier,
  validateUpdateSupplier,
};
