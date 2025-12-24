const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const {
  validateCreateDepartment,
  validateUpdateDepartment,
} = require("../validators/department.validator");

// getAll
router.get("/", departmentController.getDepartments);

// getById
router.get("/:id", departmentController.getDepartment);

// create
router.post(
  "/",
  validateCreateDepartment,
  departmentController.createDepartment
);

// updateById
router.put(
  "/:id",
  validateUpdateDepartment,
  departmentController.updateDepartment
);

// deleteById
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
