const { periodRegex } = require("../utils/regex.utils");
const { validateDecimalField } = require("../utils/validators.utils");

const validateCreatePayroll = async (req, res, next) => {
  if (req.body.id_payroll !== undefined) {
    return res.status(400).json({ error: "Payroll ID must not be provided" });
  }

  if (req.body.net_salary !== undefined) {
    return res
      .status(400)
      .json({ error: "Net salary is calculated automatically" });
  }

  const {
    period,
    base_salary,
    overtime_hours,
    deductions,
    taxes,
    payment_date,
    id_employee,
  } = req.body;

  // PERIOD
  if (!period || typeof period !== "string" || period.trim().length === 0) {
    return res.status(400).json({ error: "Period must be a non-empty string" });
  }

  if (!periodRegex.test(period.trim())) {
    return res.status(400).json({ error: "Period must be in YYYY-MM format" });
  }

  try {
    // BASE_SALARY
    const baseSalary = validateDecimalField(base_salary, "Base salary");

    // OVERTIME_HOURS -> OPTIONAL
    const overtimeHours = validateDecimalField(
      overtime_hours,
      "Overtime hours",
      { required: false }
    );

    // DEDUCTIONS
    const normalizedDeductions = validateDecimalField(deductions, "Deductions");

    // TAXES
    const normalizedTaxes = validateDecimalField(taxes, "Taxes");

    // NORMALIZE
    req.body.base_salary = baseSalary;
    if (overtimeHours !== null) {
      req.body.overtime_hours = overtimeHours;
    }
    req.body.deductions = normalizedDeductions;
    req.body.taxes = normalizedTaxes;

    // NET_SALARY
    req.body.net_salary = baseSalary - normalizedDeductions - normalizedTaxes;
  } catch (error) {
    return next(error);
  }

  // PAYMENT_DATE --> YYYY-MM-DD
  if (!payment_date || typeof payment_date !== "string") {
    return res
      .status(400)
      .json({ error: "Payment date is required and must be a string" });
  }

  const trimmedPaymentDate = payment_date.trim();
  const parsedPaymentDate = new Date(trimmedPaymentDate);

  if (isNaN(parsedPaymentDate.getTime())) {
    return res.status(400).json({ error: "Payment date must be a valid date" });
  }

  const now = new Date();
  if (parsedPaymentDate.getTime() > now.getTime()) {
    return res.status(400).json({
      error: "Payment date cannot be in the future",
    });
  }

  // ID_EMPLOYEE
  if (!id_employee || typeof id_employee !== "number") {
    return res.status(400).json({ error: "The employee ID must be a number" });
  }

  //   NORMALIZE
  req.body.period = period.trim();
  req.body.payment_date = parsedPaymentDate;
  next();
};

module.exports = {
  validateCreatePayroll,
};
