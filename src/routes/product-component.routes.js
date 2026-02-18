const express = require("express");
const router = express.Router();
const productComponentController = require("../controllers/product-component.controller");
const {
  validateCreateProductComponent,
  validateUpdateProductComponent,
} = require("../validators/product-component.validator");

// getAllProductComponents
router.get("/", productComponentController.getAllProductComponents);

// getProductComponentById
router.get(
  "/:id_product/:id_component",
  productComponentController.getProductComponentById,
);

// createProductComponent
router.post(
  "/",
  validateCreateProductComponent,
  productComponentController.createProductComponent,
);

// updateProductComponent
router.put(
  "/:id_product/:id_component",
  validateUpdateProductComponent,
  productComponentController.updateProductComponent,
);

// deleteProductComponent
router.delete(
  "/:id_product/:id_component",
  productComponentController.deleteProductComponent,
);

module.exports = router;
