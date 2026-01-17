const express = require("express");
const router = express.Router();
const supplierProductInventoryController = require("../controllers/supplier-product-inventory.controller");
const {
  validateCreateSupplierProductInventory,
  validateUpdateSupplierProductInventory,
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
  validateCreateSupplierProductInventory,
  supplierProductInventoryController.createSupplierProductInventory
);

// updateSupplierProductInventory
router.put(
  "/supplier-product/:id_supplier_product/warehouse/:id_warehouse",
  validateUpdateSupplierProductInventory,
  supplierProductInventoryController.updateInventory
);

// deleteSupplierInventory
router.delete(
  "/supplier-product/:id_supplier_product/warehouse/:id_warehouse",
  supplierProductInventoryController.deleteInventory
);

module.exports = router;
