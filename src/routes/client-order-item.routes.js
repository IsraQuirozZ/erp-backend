const express = require("express");
const router = express.Router();
const clientOrderItemController = require("../controllers/client-order-item.controller");
const {
  validateCreateClientOrderItem,
  validateUpdateClientOrderItem,
} = require("../validators/client-order-item.validator");

// getClientOrderItemsById
router.get(
  "/client-order/:id_client_order/product/:id_product",
  clientOrderItemController.getClientrOrderItemsById,
);

// createClientOrderItem
router.post(
  "/",
  validateCreateClientOrderItem,
  clientOrderItemController.createClientOrderItem,
);

// updateClientOrderItemById
router.put(
  "/client-order/:id_client_order/product/:id_product",
  validateUpdateClientOrderItem,
  clientOrderItemController.updateClientOrderItemById,
);

// deleteClientOrderItemById
router.delete(
  "/client-order/:id_client_order/product/:id_product",
  clientOrderItemController.deleteClientOrderItemById,
);

module.exports = router;
