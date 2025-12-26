const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payroll.controller");
const { validateCreatePayroll } = require("../validators/payroll.validator");

// getAllPayrolls
router.get("/", payrollController.getAllPayrolls);
// getPayrollById
router.get("/:id", payrollController.getPayrollById);
// createPayroll
router.post("/", validateCreatePayroll, payrollController.createPayroll);

module.exports = router;
