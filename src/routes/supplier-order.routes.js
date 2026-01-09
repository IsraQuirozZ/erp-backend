const express = require("express");
const router = express.Router();
const supplierOrderController = require("../controllers/supplier-order.controller");
const {
  validateCreateSupplierOrder,
  validateUpdateSupplierOrder,
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

// updateOrderById
router.put(
  "/:id",
  validateUpdateSupplierOrder,
  supplierOrderController.updateSupplierOrderById
);

// deleteOrderById -> Soft delete
router.delete("/:id", supplierOrderController.deleteSupplierOrderById);
module.exports = router;
