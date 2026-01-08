const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const {
  validateCreateSupplier,
  validateUpdateSupplier,
} = require("../validators/supplier.validator");

router.get("/", supplierController.getSuppliers);
router.get("/:id", supplierController.getSupplier);
router.post("/", validateCreateSupplier, supplierController.createSupplier);
router.put(
  "/:id",
  validateUpdateSupplier,
  supplierController.updateSupplierById
);
router.delete("/:id", supplierController.deleteSupplierById);

module.exports = router;
