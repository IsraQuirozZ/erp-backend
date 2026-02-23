const express = require("express");
const router = express.Router();
const clientOrderController = require("../controllers/client-order.controller");
const {
  validateCreateClientOrder,
  validateUpdateClientOrder,
} = require("../validators/client-order.validator");

// getAllClientOrders
router.get("/", clientOrderController.getAllClientOrders);

// getClientOrderById
router.get("/:id", clientOrderController.getClientOrderById);

// createClientOrder
router.post(
  "/",
  validateCreateClientOrder,
  clientOrderController.createClientOrder,
);

// updateClientOrderById
router.put(
  "/:id",
  validateUpdateClientOrder,
  clientOrderController.updateClientOrderById,
);

// cancelClientOrderById
// router.delete("/:id", clientOrderController.cancelClientOrderById);

// deleteClientOrderById
router.delete("/delete/:id", clientOrderController.deleteClientOrderById);

module.exports = router;
