const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateCreateFullEmployee,
  validateUpdateFullEmployee,
} = require("../validators/employee.validator");

// getAllEmployees
router.get("/", employeeController.getEmployees);

// getEmployeeById
router.get("/:id", employeeController.getEmployeeById);

// createEmployee
router.post("/", validateCreateEmployee, employeeController.createEmployee);

// createFullEmployee
// USE CASE
router.post(
  "/full",
  validateCreateFullEmployee,
  employeeController.createFullEmployee,
);

// updateEmployeeById
router.put(
  "/:id",
  validateUpdateEmployee,
  employeeController.updateEmployeeById,
);

// USE CASE
// updateFullEmployee
router.put(
  "/full/:id",
  validateUpdateFullEmployee,
  employeeController.updateFullEmployee,
);

// deleteEmployeeById
router.delete("/:id", employeeController.deleteEmployeeById);

module.exports = router;
