const express = require("express");
const router = express.Router();
const productInventoryController = require("../controllers/product-inventory.controller");
const {
  validateCreateProductInventory,
  validateUpdateProductInventory,
} = require("../validators/product-inventory.validator");

// getAllProductInventories
router.get("/", productInventoryController.getAllInventories);

// getProductInventoryById
router.get(
  "/product/:id_product/warehouse/:id_warehouse",
  productInventoryController.getInventory
);

// getInventoryByWarehouse

// getInventoryByProduct

// createProductInventory
router.post(
  "/",
  validateCreateProductInventory,
  productInventoryController.createInventory
);

// updateProductInventory
router.put(
  "/product/:id_product/warehouse/:id_warehouse",
  validateUpdateProductInventory,
  productInventoryController.updateInventory
);

// deleteInventory
router.delete(
  "/product/:id_product/warehouse/:id_warehouse",
  productInventoryController.deleteInventory
);

module.exports = router;
