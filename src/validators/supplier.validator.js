const { capitalize } = require("../utils/string.utils");
const {
  onlyLettersRegex,
  phoneRegex,
  emailRegex,
} = require("../utils/regex.utils");

const validateCreateSupplier = (req, res, next) => {
  const { name, phone, email, id_address } = req.body || {};

  const normalizedName = name?.trim();
  const normalizedPhone = phone?.trim();
  const normalizedEmail = email?.trim();

  // NAME
  if (!name || typeof name !== "string" || normalizedName.length < 3) {
    return res.status(400).json({
      error: "The supplier's name must be a non-empty string",
    });
  }

  if (!onlyLettersRegex.test(normalizedName)) {
    return res.status(400).json({
      error: "The supplier's name must contain only letters",
    });
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

  // ID_ADDRESS
  if (!id_address || typeof id_address !== "number") {
    return res.status(400).json({ error: "The address ID must be a number" });
  }

  // NORMALIZE
  req.body.name = capitalize(normalizedName);
  req.body.phone = normalizedPhone;
  req.body.email = normalizedEmail;

  next();
};

module.exports = {
  validateCreateSupplier,
};
