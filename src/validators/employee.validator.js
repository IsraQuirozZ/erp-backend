const { capitalize } = require("../utils/string.utils");
const {
  onlyLettersRegex,
  phoneRegex,
  emailRegex,
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

  // HIRE_DATE

  // NORMALIZE
  req.body.firstName = capitalize(firstName.trim());
  req.body.lastName = capitalize(lastName.trim());
  req.body.phone = phone.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.job_title = capitalize(job_title().trim());
  next();
};

module.exports = {
  validateCreateEmployee,
};
