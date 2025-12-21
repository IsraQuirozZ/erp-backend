const { capitalize } = require("../utils/string.utils");
const {
  onlyLettersRegex,
  phoneRegex,
  emailRegex,
} = require("../utils/regex.utils");

const validateCreateClient = (req, res, next) => {
  const { firstName, lastName, phone, email, id_address } = req.body;

  // firstName
  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.trim().length < 3
  ) {
    return res.status(400).json({
      error: "The name nust be a non-empty string",
    });
  }

  if (!onlyLettersRegex.test(firstName.trim())) {
    return res.status(400).json({
      error: "The name must contain only letters",
    });
  }

  // lastName
  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 3) {
    return res.status(400).json({
      error: "The last name must be a non-empty string",
    });
  }

  if (!onlyLettersRegex.test(lastName.trim())) {
    return res.status(400).json({
      error: "The last name must contain only letters",
    });
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

  // id_address
  if (!id_address || typeof id_address !== "number") {
    return res.status(400).json({ error: "The address ID must be a number" });
  }

  req.body.firstName = capitalize(firstName.trim());
  req.body.lastName = capitalize(lastName.trim());
  req.body.phone = phone.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

const validateUpdateClient = (req, res, next) => {
  const { firstName, lastName, phone, email, id_address } = req.body;

  if (
    firstName === undefined &&
    lastName === undefined &&
    phone === undefined &&
    email === undefined &&
    id_address === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the client",
    });
  }

  // firstName
  if (firstName !== undefined) {
    if (typeof firstName !== "string" || firstName.trim().length < 3) {
      return res.status(400).json({
        error: "The name nust be a non-empty string",
      });
    }

    if (!onlyLettersRegex.test(firstName.trim())) {
      return res.status(400).json({
        error: "The name must contain only letters",
      });
    }

    req.body.firstName = capitalize(firstName.trim());
  }

  // lastName
  if (lastName !== undefined) {
    if (typeof lastName !== "string" || lastName.trim().length < 3) {
      return res.status(400).json({
        error: "The last name must be a non-empty string",
      });
    }

    if (!onlyLettersRegex.test(lastName.trim())) {
      return res.status(400).json({
        error: "The last name must contain only letters",
      });
    }
    req.body.lastName = capitalize(lastName.trim());
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

  next();
};

module.exports = {
  validateCreateClient,
  validateUpdateClient,
};
