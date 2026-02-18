const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../validators/product.validator");

// getAllProducts
router.get("/", productController.getAllProducts);

// getProductById
router.get("/:id", productController.getProductById);

// getProductComponentsByProductId
router.get(
  "/:id/components",
  productController.getProductComponentsByProductId,
);

// createProduct
router.post("/", validateCreateProduct, productController.createProduct);

// updateProductById
router.put("/:id", validateUpdateProduct, productController.updateProductById);

// deleteProductById
router.delete("/:id", productController.deleteProductById);

module.exports = router;
