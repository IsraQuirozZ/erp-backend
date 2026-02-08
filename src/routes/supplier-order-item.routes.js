const express = require("express");
const router = express.Router();
const supplierOrderItemController = require("../controllers/supplier-order-item.controller");
const {
  validateCreateSupplierOrderItem,
  validateUpdateSupplierOrderItem,
} = require("../validators/supplier-order-item.validator");

// getItemsBySupplierOrder
router.get(
  "/:id/supplier-order",
  supplierOrderItemController.getItemsBySupplierOrder,
);

// getSupplierOrderItemById -> just for admin (debug)
router.get("/:id", supplierOrderItemController.getSupplierOrderItemsById);

// createSupplierOrderItem
router.post(
  "/",
  validateCreateSupplierOrderItem,
  supplierOrderItemController.createSupplierOrderItem,
);

// updateSupplierOrderById
router.put(
  "/:id",
  validateUpdateSupplierOrderItem,
  supplierOrderItemController.updateSupplierOrderItemById,
);

// deleteSupplierOrderItemById
router.delete(
  "/:id_supplier_order/:id_component",
  supplierOrderItemController.deleteSupplierOrderItemById,
);

module.exports = router;
