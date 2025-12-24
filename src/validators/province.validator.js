const { capitalize } = require("../utils/string.utils");
const { onlyLettersRegex } = require("../utils/regex.utils");

// CreateProvince Validator
const validateCreateProvince = (req, res, next) => {
  if (req.body.id_province !== undefined) {
    return res.status(400).json({
      error: "Province ID must not be provided",
    });
  }

  const { name } = req.body;

  // 1. Not Exists // No-String // Empty
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      error: "The province name must be a non-empty string",
    });
  }

  // Only Letters
  if (!onlyLettersRegex.test(name.trim())) {
    return res.status(400).json({
      error: "The province name must contain only letters and spaces",
    });
  }

  // Normalize input
  req.body.name = capitalize(name.trim());

  next(); // All good
};

// UpdateProvince Validator
const validateUpdateProvince = (req, res, next) => {
  const { name } = req.body;

  // If Empty ->  error
  if (!name) {
    return res.status(400).json({
      error: "At least one field must be provided to update the province",
    });
  }

  // If name -> validate (String, non-empty string, only letters)
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        error: "The province name must be a non-empty string",
      });
    }

    if (!onlyLettersRegex.test(name.trim())) {
      return res.status(400).json({
        error: "The province name must contain only letters and spaces",
      });
    }

    req.body.name = capitalize(name.trim());
  }

  next();
};

module.exports = {
  validateCreateProvince,
  validateUpdateProvince,
};
