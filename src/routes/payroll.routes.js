const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payroll.controller");
const {
  validateCreatePayroll,
  validateUpdatePayroll,
} = require("../validators/payroll.validator");

// getAllPayrolls
router.get("/", payrollController.getAllPayrolls);
// getPayrollById
router.get("/:id", payrollController.getPayrollById);
// createPayroll
router.post("/", validateCreatePayroll, payrollController.createPayroll);
// updatePayrollById
router.put("/:id", validateUpdatePayroll, payrollController.updatePayrollById);
// delete
router.delete("/:id", payrollController.deletePayrollById);

module.exports = router;
