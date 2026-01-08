const { capitalize } = require("../utils/string.utils");
const {
  onlyLettersRegex,
  phoneRegex,
  emailRegex,
} = require("../utils/regex.utils");
const {
  validateDecimalField,
  validateStringField,
} = require("../utils/validators.utils");

const validateCreateEmployee = async (req, res, next) => {
  if (req.body.id_employee !== undefined) {
    return res.status(400).json({
      error: "Employee ID must not be provided",
    });
  }

  const {
    firstName,
    lastName,
    phone,
    email,
    job_title,
    hire_date,
    base_salary,
    id_address,
    id_department,
    active,
  } = req.body;

  // PHONE
  if (!phone || typeof phone !== "string" || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({ error: "Phone number must have 9 digits" });
  }

  // EMAIL
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res
      .status(400)
      .json({ error: "Email must be a valid email address" });
  }

  // HIRE_DATE -> Standar format: YYYY/MM/DD
  if (!hire_date || typeof hire_date !== "string") {
    return res
      .status(400)
      .json({ error: "Hire date is required and must be a string" });
  }

  const trimmedHireDate = hire_date.trim();
  const parsedHireDate = new Date(trimmedHireDate);

  if (isNaN(parsedHireDate.getTime())) {
    return res.status(400).json({
      error: "Hire date must be a valid date",
    });
  }

  const now = new Date();
  if (parsedHireDate.getTime() > now.getTime()) {
    return res.status(400).json({
      error: "Hire date cannot be in the future",
    });
  }

  try {
    // FIRSTNAME
    req.body.firstName = validateStringField(firstName, "Name", {
      onlyLetters: true,
    });

    // LASTNAME
    req.body.lastName = validateStringField(lastName, "Last Name", {
      onlyLetters: true,
    });

    // JOB_TITLE
    req.body.job_title = validateStringField(job_title, "Last Name", {
      onlyLetters: true,
      capitalizeFirst: true,
    });

    // BASE_SALARY
    req.body.base_salary = validateDecimalField(base_salary, "Base salary");
  } catch (error) {
    next(error);
  }

  // ACTIVE
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  // ID_ADDRESS
  if (!id_address || typeof id_address !== "number") {
    return res.status(400).json({ error: "The address ID must be a number" });
  }

  // ID_DEPARTMENT
  if (!id_department || typeof id_department !== "number") {
    return res
      .status(400)
      .json({ error: "The department ID must be a number" });
  }

  // NORMALIZE
  req.body.phone = phone.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.hire_date = parsedHireDate;
  if (active === undefined) {
    req.body.active = true;
  }

  next();
};

const validateUpdateEmployee = async (req, res, next) => {
  if (req.body.id_employee !== undefined) {
    return res.status(400).json({
      error: "Employee ID must not be provided",
    });
  }
  const {
    firstName,
    lastName,
    phone,
    email,
    job_title,
    hire_date,
    base_salary,
    id_address,
    id_department,
    active,
  } = req.body;

  if (
    firstName === undefined &&
    lastName === undefined &&
    phone === undefined &&
    email === undefined &&
    job_title === undefined &&
    hire_date === undefined &&
    base_salary === undefined &&
    id_address === undefined &&
    id_department === undefined &&
    active === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the employee",
    });
  }

  // PHONE
  if (phone !== undefined) {
    if (typeof phone !== "string" || !phoneRegex.test(phone.trim())) {
      return res
        .status(400)
        .json({ error: "Phone number must contain 9 digits" });
    }

    req.body.phone = phone.trim();
  }

  // EMAIL
  if (email !== undefined) {
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res
        .status(400)
        .json({ error: "Email must be a valid email address" });
    }

    req.body.email = email.trim().toLowerCase();
  }

  // HIRE_DATE
  if (hire_date !== undefined) {
    if (typeof hire_date !== "string") {
      return res.status(400).json({ error: "Hire date must be a string" });
    }

    const trimmedHireDate = hire_date.trim();
    const parsedHireDate = new Date(trimmedHireDate);

    if (isNaN(parsedHireDate.getTime())) {
      return res.status(400).json({
        error: "Hire date must be a valid date",
      });
    }

    const today = new Date();
    if (parsedHireDate.getTime() > today.getTime()) {
      return res.status(400).json({
        error: "Hire date cannot be in the future",
      });
    }

    req.body.hire_date = parsedHireDate;
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

    // JOB_TITLE
    if (job_title !== undefined) {
      req.body.job_title = validateStringField(job_title, "Last Name", {
        onlyLetters: true,
        capitalizeFirst: true,
      });
    }

    // BASE_SALARY
    req.body.base_salary = validateDecimalField(base_salary, "Base salary");
  } catch (error) {
    next(error);
  }

  // ID_ADDRESS
  if (id_address !== undefined && typeof id_address !== "number") {
    return res.status(400).json({ error: "The address ID must be a number" });
  }

  // ID_DEPARTMENT
  if (id_department !== undefined && typeof id_department !== "number") {
    return res
      .status(400)
      .json({ error: "The department ID must be a number" });
  }

  // ACTIVE (OPTIONAL, DEFAULT TRUE)
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ error: "Active must be a boolean value" });
  }

  next();
};

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
};
