const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const {
  validateCreateSupplier,
  validateUpdateSupplier,
  validateCreateFullSupplier,
  validateUpdateFullSupplier,
} = require("../validators/supplier.validator");

// getAllSuppliers
router.get("/", supplierController.getSuppliers);

// getSupplierById
router.get("/:id", supplierController.getSupplier);

// getOrdersBySupplierId
router.get("/:id/orders", supplierController.getOrdersBySupplierId);

// create
router.post("/", validateCreateSupplier, supplierController.createSupplier);

// USE CASE
router.post(
  "/full",
  validateCreateFullSupplier,
  supplierController.createFullSupplier,
);

// update
router.put(
  "/:id",
  validateUpdateSupplier,
  supplierController.updateSupplierById,
);

// USE CASE
router.put(
  "/full/:id",
  validateUpdateFullSupplier,
  supplierController.updateFullSupplier,
);

// delete -> softDelete
router.delete("/:id", supplierController.deleteSupplierById);

module.exports = router;
