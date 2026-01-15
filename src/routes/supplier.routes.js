const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const {
  validateCreateSupplier,
  validateUpdateSupplier,
} = require("../validators/supplier.validator");

// getAllSuppliers
router.get("/", supplierController.getSuppliers);

// getSupplierById
router.get("/:id", supplierController.getSupplier);

// getProductsBySupplierId
router.get("/:id/products", supplierController.getProductsBySupplierId);

// getOrdersBySupplierId
router.get("/:id/orders", supplierController.getOrdersBySupplierId);

// create
router.post("/", validateCreateSupplier, supplierController.createSupplier);

// update
router.put(
  "/:id",
  validateUpdateSupplier,
  supplierController.updateSupplierById
);

// delete -> softDelete
router.delete("/:id", supplierController.deleteSupplierById);

module.exports = router;
