const express = require("express");
const router = express.Router();
const supplierProductController = require("../controllers/supplier-product.controller");
const {
  validateCreateSupplierProduct,
  validateUpdateSupplierProduct,
} = require("../validators/supplier-product.validator");

// getAllProducts
router.get("/", supplierProductController.getAllSupplierProducts);

// getProductById
router.get("/:id", supplierProductController.getSupplierProductById);

// createSupplierProduct
router.post(
  "/",
  validateCreateSupplierProduct,
  supplierProductController.createSupplierProduct
);

// updateSupplierProductById
router.put(
  "/:id",
  validateUpdateSupplierProduct,
  supplierProductController.updateSupplierProductById
);

// softDeleteSupplierProductById
router.delete("/:id", supplierProductController.deleteSupplierProductById);

module.exports = router;
