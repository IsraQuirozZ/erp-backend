const { decimalRegex, onlyLettersRegex } = require("./regex.utils");
const { CapitalizeFirstLetter, capitalize } = require("./string.utils");

const validateDecimalField = (value, fieldName, { required = true } = {}) => {
  // 1. No field
  if (value === undefined) {
    if (required) {
      throw {
        status: 400,
        message: `${fieldName} is required`,
      };
    }
    return null; // Optional y not sended -> OK
  }

  // 2. Wrong Type of or empty string
  if (typeof value !== "string" || value.trim().length === 0) {
    throw {
      status: 400,
      message: `${fieldName} must be a non-empty string`,
    };
  }

  const trimmedValue = value.trim();

  // 3. Decimal Validation -> decimalRegex
  if (!decimalRegex.test(trimmedValue)) {
    throw {
      status: 400,
      message: `${fieldName} must be a decimal number`,
    };
  }

  // 4. Normalize
  if (parseFloat(trimmedValue) <= 0) {
    throw {
      status: 400,
      message: `${fieldName} must be a positive number`,
    };
  }
  return parseFloat(trimmedValue);
};

const validateStringField = (
  value,
  fieldName,
  { required = true, onlyLetters = false, capitalizeFirst = false } = {}
) => {
  // onlyletters just for names, last names... etc.
  // capitalizeFirst: true if capitalize util
  if (value === undefined) {
    if (required) {
      throw {
        status: 400,
        message: `${fieldName} is required`,
      };
    }
    return null;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw {
      status: 400,
      message: `${fieldName} must be a non-empty string`,
    };
  }

  const trimmedValue = value.trim();

  if (onlyLetters && !onlyLettersRegex.test(trimmedValue)) {
    throw {
      status: 400,
      message: `${fieldName} must contain only letters`,
    };
  }

  return !capitalizeFirst
    ? capitalize(trimmedValue)
    : CapitalizeFirstLetter(trimmedValue);
};

module.exports = { validateDecimalField, validateStringField };
