const express = require("express");
const router = express.Router();
const supplierProductInventoryController = require("../controllers/supplier-product-inventory.controller");
const {
  validateCreateSupplierproductInventory,
} = require("../validators/supplier-product-inventory.validator");

// getAllSupplierProductInventories
router.get("/", supplierProductInventoryController.getAllInventories);

// getSupplierProductInventoryById
router.get(
  "/supplier-product/:id_supplier_product/warehouse/:id_warehouse",
  supplierProductInventoryController.getInventory
);

// getInventoryByWarehouse

// getInventoryBySupplierProduct

// createSupplierProductInventory
router.post(
  "/",
  validateCreateSupplierproductInventory,
  supplierProductInventoryController.createSupplierProductInventory
);

module.exports = router;
