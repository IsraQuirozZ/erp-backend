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
router.get("/:id", supplierProductController.getComponentById);

// getProductsBySupplierId
router.get(
  "/supplier/:id",
  supplierProductController.getComponentsBySupplierId,
);

// createSupplierProduct
router.post(
  "/",
  validateCreateSupplierProduct,
  supplierProductController.createSupplierProduct,
);

// updateSupplierProductById
router.put(
  "/:id",
  validateUpdateSupplierProduct,
  supplierProductController.updateComponentById,
);

// softDeleteSupplierProductById
router.delete("/:id", supplierProductController.deleteComponentById);

module.exports = router;
