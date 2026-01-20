const { phoneRegex, emailRegex } = require("../utils/regex.utils");
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
    req.body.job_title = validateStringField(job_title, "Job Title", {
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

// USE CASE
const validateCreateFullEmployee = (req, res, next) => {
  const { province, address, department, employee } = req.body;

  if (!province || !address || !department || !employee) {
    return res.status(400).json({
      error: "Department, Employee, Address and Province are required",
    });
  }

  if (
    province.id_province !== undefined ||
    address.id_address !== undefined ||
    employee.id_employee !== undefined ||
    department.id_department !== undefined
  ) {
    return res.status(400).json({
      error: "ID's must not be provided",
    });
  }

  try {
    // EMPLOYEE
    // FIRSTNAME
    employee.firstName = validateStringField(employee.firstName, "Name", {
      onlyLetters: true,
    });

    // LASTNAME
    employee.lastName = validateStringField(employee.lastName, "Last Name", {
      onlyLetters: true,
    });

    // PHONE
    if (
      !employee.phone ||
      typeof employee.phone !== "string" ||
      !phoneRegex.test(employee.phone.trim())
    ) {
      return res.status(400).json({
        error: "The phone number must have 9 digits",
      });
    }

    // EMAIL
    if (
      !employee.email ||
      typeof employee.email !== "string" ||
      !emailRegex.test(employee.email.trim())
    ) {
      return res.status(400).json({
        error: "Email must be a valid email address",
      });
    }

    // JOB_TITLE
    employee.job_title = validateStringField(employee.job_title, "Job Title", {
      onlyLetters: true,
    });

    // HIRE_DATE -> Standar format: YYYY/MM/DD
    if (!employee.hire_date || typeof employee.hire_date !== "string") {
      return res
        .status(400)
        .json({ error: "Hire date is required and must be a string" });
    }

    const trimmedHireDate = employee.hire_date.trim();
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

    // BASE_SALARY
    employee.base_salary = validateDecimalField(
      employee.base_salary,
      "Base salary",
    );

    // ACTIVE
    if (employee.active !== undefined && typeof employee.active !== "boolean") {
      return res.status(400).json({ error: "Active must be a boolean value" });
    }

    // NORMALIZE
    employee.phone = employee.phone.trim();
    employee.email = employee.email.trim().toLowerCase();
    employee.hire_date = parsedHireDate;
    if (employee.active === undefined) {
      employee.active = true;
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

    // POSTAL_CODE
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

    // DEPARTMENT
    department.name = validateStringField(department.name, "Department Name", {
      onlyLetters: true,
    });

    department.desc = validateStringField(department.desc, "Description", {
      required: false,
      capitalizeFirst: true,
    });
  } catch (error) {
    return next(error);
  }
  next();
};

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateCreateFullEmployee,
};
