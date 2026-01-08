const { phoneRegex, emailRegex } = require("../utils/regex.utils");
const { validateStringField } = require("../utils/validators.utils");

const validateCreateClient = (req, res, next) => {
  if (req.body.id_client) {
    return res.status(400).json({ error: "Client ID must be not provided" });
  }

  const { firstName, lastName, phone, email, id_address, active } = req.body;

  try {
    // FIRSTNAME
    req.body.firstName = validateStringField(firstName, "Name", {
      onlyLetters: true,
    });

    // LASTNAME
    req.body.lastName = validateStringField(lastName, "Last Name", {
      onlyLetters: true,
    });
  } catch (error) {
    return next(error);
  }

  // phone
  if (!phone || typeof phone !== "string" || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({
      error: "The phone number must have 9 digits",
    });
  }

  // EMAIL
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: "Email must be a valid email address",
    });
  }

  // ACTIVE
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  // id_address
  if (!id_address || typeof id_address !== "number") {
    return res.status(400).json({ error: "The address ID must be a number" });
  }

  // NORMALIZE
  req.body.phone = phone.trim();
  req.body.email = email.trim().toLowerCase();
  if (active === undefined) {
    req.body.active = true;
  }

  next();
};

const validateUpdateClient = (req, res, next) => {
  if (req.body.id_client) {
    return res.status(400).json({ error: "Client ID must be not provided" });
  }
  const { firstName, lastName, phone, email, id_address, active } = req.body;

  if (
    firstName === undefined &&
    lastName === undefined &&
    phone === undefined &&
    email === undefined &&
    id_address === undefined &&
    active === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the client",
    });
  }

  try {
    // FIRSTNAME
    if (firstName !== undefined) {
      req.body.firstName = validateStringField(firstName, "Name", {
        onlyLetters: true,
      });
    }

    // LASTNAME
    if (lastName !== undefined) {
      req.body.lastName = validateStringField(lastName, "Last Name", {
        onlyLetters: true,
      });
    }
  } catch (error) {
    return next(error);
  }

  //  phone
  if (phone !== undefined) {
    if (typeof phone !== "string" || !phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        error: "The phone number must have 9 digits",
      });
    }
    req.body.phone = phone.trim();
  }

  // EMAIL
  if (email !== undefined) {
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: "Email must be a valid email address",
      });
    }

    req.body.email = email.trim().toLowerCase();
  }

  // id_address
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
  validateCreateClient,
  validateUpdateClient,
};
