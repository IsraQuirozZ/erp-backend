const express = require("express");
const router = express.Router();
const clientOrderController = require("../controllers/client-order.controller");
const {
  validateCreateClientOrder,
  validateUpdateClientOrder,
} = require("../validators/client-order.validator");

// getAllOrders
router.get("/", clientOrderController.getAllClientOrders);

// getAOrderbyId
router.get("/:id", clientOrderController.getClientOrderById);

// getItemsBySupplierOrder
router.get("/:id/items", clientOrderController.getItemsByClientOrder);

// createSupplierOrder
router.post(
  "/",
  validateCreateClientOrder,
  clientOrderController.createClientOrder,
);

// updateOrderById
router.put(
  "/:id",
  validateUpdateClientOrder,
  clientOrderController.updateClientOrderById,
);

// cancelClientOrderById
router.delete("/:id", clientOrderController.cancelClientOrderById);
module.exports = router;
