const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipment.controller");
const {
  validateCreateShipment,
  validateUpdateShipment,
} = require("../validators/shipment.validator");

// getAllShipments
router.get("/", shipmentController.getAllShipments);

// getShipmentByStatus

// getShipmentById
router.get("/:id", shipmentController.getShipmentById);

// createShipment -> Only when ClientOrder status: "CONFIRMED"
router.post("/", validateCreateShipment, shipmentController.createShipment);

// updateShipmentById -> Just Status and dates allowed
router.put(
  "/:id",
  validateUpdateShipment,
  shipmentController.updateShipmentById,
);

// deleteShipmentById
router.delete("/:id", shipmentController.deleteShipmentById);

module.exports = router;
