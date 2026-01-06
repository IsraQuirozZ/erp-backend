const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const {
  validateCreateEmployee,
  validateUpdateEmployee,
} = require("../validators/employee.validator");

// getAllEmployees
router.get("/", employeeController.getEmployees);

// getEmployeeById
router.get("/:id", employeeController.getEmployeeById);

// createEmployee
router.post("/", validateCreateEmployee, employeeController.createEmployee);

// updateEmployeeById
router.put(
  "/:id",
  validateUpdateEmployee,
  employeeController.updateEmployeeById
);

// deleteEmployeeById
router.delete("/:id", employeeController.deleteEmployeeById);

module.exports = router;
