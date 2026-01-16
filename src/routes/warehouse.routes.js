const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouse.controller");
const {
  validateCreateWarehouse,
  validateUpdateWarehouse,
} = require("../validators/warehouse.validator");

// getAllWarehouses
router.get("/", warehouseController.getAllWarehouses);

// getWarehouseById
router.get("/:id", warehouseController.getWarehouseById);

// createWarehouse
router.post("/", validateCreateWarehouse, warehouseController.createWarehouse);

// updateWarehouse
router.put(
  "/:id",
  validateUpdateWarehouse,
  warehouseController.updateWarehouseById
);

// deleteWarehouseById
router.delete("/:id", warehouseController.deleteWarehouseById);

module.exports = router;
