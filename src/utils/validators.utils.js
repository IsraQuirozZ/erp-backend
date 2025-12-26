const { decimalRegex } = require("./regex.utils");
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
  return parseFloat(trimmedValue);
};

module.exports = { validateDecimalField };
