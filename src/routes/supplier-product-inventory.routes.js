const express = require("express");
const router = express.Router();
const supplierProductInventoryController = require("../controllers/supplier-product-inventory.controller");
const {
  validateCreateSupplierproductInventory,
  validateUpdateSupplierproductInventory,
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

// updateSupplierProductInventory
router.put(
  "/supplier-product/:id_supplier_product/warehouse/:id_warehouse",
  validateUpdateSupplierproductInventory,
  supplierProductInventoryController.updateInventory
);

// deleteSupplierInventory
router.delete(
  "/supplier-product/:id_supplier_product/warehouse/:id_warehouse",
  supplierProductInventoryController.deleteInventory
);

module.exports = router;
