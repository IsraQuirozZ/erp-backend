const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipment.controller");
const { validateCreateShipment } = require("../validators/shipment.validator");

// getAllShipments
router.get("/", shipmentController.getAllShipments);

// getShipmentByStatus

// getShipmentById
router.get("/:id", shipmentController.getShipmentById);

// createShipment -> Only when ClientOrder status: "CONFIRMED"
router.post("/", validateCreateShipment, shipmentController.createShipment);

module.exports = router;
