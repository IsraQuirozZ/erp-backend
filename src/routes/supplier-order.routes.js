const express = require("express");
const router = express.Router();
const supplierOrderController = require("../controllers/supplier-order.controller");
const {
  validateCreateSupplierOrder,
} = require("../validators/supplier-order.validator");

// getAllOrders
router.get("/", supplierOrderController.getAllSupplierOrders);
// getAOrderbyId
router.get("/:id", supplierOrderController.getSupplierOrderById);
// createSupplierOrder
router.post(
  "/",
  validateCreateSupplierOrder,
  supplierOrderController.createSupplierOrder
);

module.exports = router;
