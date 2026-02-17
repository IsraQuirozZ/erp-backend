const express = require("express");
const router = express.Router();
const productComponentController = require("../controllers/product-component.controller");
const {
  validateCreateProductComponent,
} = require("../validators/product-component.validator");

// getAllProductComponents
router.get("/", productComponentController.getAllProductComponents);

// createProductComponent
router.post(
  "/",
  validateCreateProductComponent,
  productComponentController.createProductComponent,
);

module.exports = router;
