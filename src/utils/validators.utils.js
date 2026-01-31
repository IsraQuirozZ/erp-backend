const {
  decimalRegex,
  onlyLettersRegex,
  onlyNumbersRegex,
  onlyLettersAndNumbersRegex,
} = require("./regex.utils");
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
  {
    required = true,
    onlyLetters = false,
    capitalizeFirst = false,
    onlyLettersAndNumbers = false,
  } = {},
) => {
  // onlyletters just for names, last names... etc.
  // capitalizeFirst: true if capitalize just the first
  if (value === undefined) {
    if (required) {
      throw {
        status: 400,
        message: `${fieldName} is required`,
      };
    }
    return null;
  }

  if (!required && (value.trim().length === 0 || value === undefined)) {
    return null;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw {
      status: 400,
      message: `${fieldName} must be a non-empty string`,
    };
  }

  let trimmedValue = value.trim();

  if (onlyLetters && !onlyLettersRegex.test(trimmedValue)) {
    throw {
      status: 400,
      message: `${fieldName} must contain only letters`,
    };
  }

  if (onlyLettersAndNumbers && !onlyLettersAndNumbersRegex.test(trimmedValue)) {
    throw {
      status: 400,
      message: `${fieldName} must contain only letters and numbers`,
    };
  }

  return !capitalizeFirst
    ? capitalize(trimmedValue)
    : CapitalizeFirstLetter(trimmedValue);
};

const validateIntField = (value, fieldName, { required = true } = {}) => {
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
      message: `${fieldName} must be a non empty string`,
    };
  }

  const trimmedValue = value.trim();

  if (!onlyNumbersRegex.test(trimmedValue)) {
    throw { status: 400, message: `${fieldName} must be a Int number` };
  }

  if (fieldName.includes("Stock")) {
    if (parseInt(trimmedValue) < 0) {
      throw {
        status: 400,
        message: `${fieldName} must be a 0 or positive number`,
      };
    }
  } else {
    if (parseInt(trimmedValue) <= 0) {
      throw {
        status: 400,
        message: `${fieldName} must be a positive number`,
      };
    }
  }

  return parseInt(trimmedValue);
};

module.exports = {
  validateDecimalField,
  validateStringField,
  validateIntField,
};
