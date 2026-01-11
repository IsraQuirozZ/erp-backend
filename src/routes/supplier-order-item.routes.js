const express = require("express");
const router = express.Router();
const supplierOrderItemController = require("../controllers/supplier-order-item.controller");
const {
  validateCreateSupplierOrderitem,
} = require("../validators/supplier-order-item.validator");

// Items from an order managed in: supplier order

// getSupplierOrderItemById -> just for admin (debug)
router.get("/:id", supplierOrderItemController.getSupplierOrderItemsById);

// createSupplierOrderItem
router.post(
  "/",
  validateCreateSupplierOrderitem,
  supplierOrderItemController.createSupplierOrderItem
);

module.exports = router;
