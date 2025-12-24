const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const { validateCreateEmployee } = require("../validators/employee.validator");

// getAllEmployees
router.get("/", employeeController.getEmployees);

// getEmployeeById
router.get("/:id", employeeController.getEmployee);

// createEmployee
router.post("/", validateCreateEmployee, employeeController.createEmployee);

module.exports = router;
