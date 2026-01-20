const { phoneRegex, emailRegex } = require("../utils/regex.utils");
const {
  validateStringField,
  validateIntField,
} = require("../utils/validators.utils");

const validateCreateClient = (req, res, next) => {
  if (req.body.id_client !== undefined) {
    return res.status(400).json({ error: "Client ID must not be provided" });
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

  // PHONE
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

  // ID_ADDRESS
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

  //  PHONE
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

// USE CASE
const validateCreateFullClient = (req, res, next) => {
  const { province, address, client } = req.body;

  if (!province || !address || !client) {
    return res
      .status(400)
      .json({ error: "Client, Address and Province are required" });
  }

  if (
    province.id_province !== undefined ||
    address.id_address !== undefined ||
    client.id_client !== undefined
  ) {
    return res.status(400).json({
      error: "ID's must not be provided",
    });
  }

  try {
    // CLIENT
    // FIRSTNAME
    client.firstName = validateStringField(client.firstName, "Name", {
      onlyLetters: true,
    });

    // LASTNAME
    client.lastName = validateStringField(client.lastName, "Last Name", {
      onlyLetters: true,
    });

    // PHONE
    if (
      !client.phone ||
      typeof client.phone !== "string" ||
      !phoneRegex.test(client.phone.trim())
    ) {
      return res.status(400).json({
        error: "The phone number must have 9 digits",
      });
    }

    // EMAIL
    if (
      !client.email ||
      typeof client.email !== "string" ||
      !emailRegex.test(client.email.trim())
    ) {
      return res.status(400).json({
        error: "Email must be a valid email address",
      });
    }

    // ACTIVE
    if (client.active !== undefined && typeof client.active !== "boolean") {
      return res.status(400).json({ error: "Active must be a boolean value" });
    }

    // NORMALIZE
    client.phone = client.phone.trim();
    client.email = client.email.trim().toLowerCase();
    if (client.active === undefined) {
      client.active = true;
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
  validateCreateClient,
  validateUpdateClient,
  validateCreateFullClient,
};
