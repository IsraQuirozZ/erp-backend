const { capitalize } = require("../utils/string.utils");
const {
  onlyLettersRegex,
  phoneRegex,
  emailRegex,
  salaryRegex,
} = require("../utils/regex.utils");

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
  } = req.body;

  // FIRSTNAME
  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.trim().length < 3
  ) {
    return res
      .status(400)
      .json({ error: "The employee must have a valid name" });
  }

  if (!onlyLettersRegex.test(firstName.trim())) {
    return res
      .status(400)
      .json({ error: "The employee name must contain only letters" });
  }

  // LASTNAME
  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "The employee must have a valid last name" });
  }

  if (!onlyLettersRegex.test(lastName.trim())) {
    return res
      .status(400)
      .json({ error: "The employee name must contain only letters" });
  }

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

  // JOB_TITLE
  if (
    !job_title ||
    typeof job_title !== "string" ||
    job_title.trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "The job title must be a non-empty string" });
  }

  if (!onlyLettersRegex.test(job_title.trim())) {
    return res
      .status(400)
      .json({ error: "The job title must contain only letters" });
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

  // BASE_SALARY
  if (
    !base_salary ||
    typeof base_salary !== "string" ||
    base_salary.trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Base salary must be non-empty string" });
  }

  if (!salaryRegex.test(base_salary.trim())) {
    return res
      .status(400)
      .json({ error: "Base salary mut have only digits aand one period" });
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
  req.body.firstName = capitalize(firstName.trim());
  req.body.lastName = capitalize(lastName.trim());
  req.body.phone = phone.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.job_title = capitalize(job_title.trim());
  req.body.hire_date = parsedHireDate;
  req.body.base_salary = parseFloat(base_salary);
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
    id_department === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the employee",
    });
  }

  // FIRSTNAME
  if (firstName !== undefined) {
    if (typeof firstName !== "string" || firstName.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "The employee must have a valid name" });
    }

    if (!onlyLettersRegex.test(firstName.trim())) {
      return res.status(400).json({ error: "Name must contain only letters" });
    }

    req.body.firstName = capitalize(firstName.trim());
  }

  // LASTNAME
  if (lastName !== undefined) {
    if (typeof lastName !== "string" || lastName.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "The employee must have a valid last name" });
    }

    if (!onlyLettersRegex.test(lastName.trim())) {
      return res
        .status(400)
        .json({ error: "Last name must contain only letters" });
    }

    req.body.lastName = capitalize(lastName.trim());
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

  // JOB_TITLE
  if (job_title !== undefined) {
    if (typeof job_title !== "string" || job_title.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Job title must be a non-empty string" });
    }

    if (!onlyLettersRegex.test(job_title.trim())) {
      return res
        .status(400)
        .json({ error: "Job title must contain only letters" });
    }

    req.body.job_title = capitalize(job_title.trim());
  }

  // HIRE_DATE
  if (hire_date !== undefined) {
    if (typeof hire_date !== "string") {
      return res.status(400).json({ error: "Hire date must be a string" });
    }

    const trimmedHireDate = hire_date.trim();
    const parsedHireDate = new Date(trimmedHireDate);

    if (isNaN(parsedHireDate.getDate())) {
      return res.status(400).json({
        error: "Hire date must be a valid date",
      });
    }

    const today = new Date();
    if (parsedHireDate > today) {
      return res.status(400).json({
        error: "Hire date cannot be in the future",
      });
    }

    req.body.hire_date = parsedHireDate;
  }

  // BASE_SALARY
  if (base_salary !== undefined) {
    if (typeof base_salary !== "string" || base_salary.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Base salary must be non-empty string" });
    }

    if (!salaryRegex.test(base_salary.trim())) {
      return res
        .status(400)
        .json({ error: "Base salary mut have only digits" });
    }

    req.body.base_salary = parseFloat(base_salary);
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

  next();
};

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
};
