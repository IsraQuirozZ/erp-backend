const express = require("express");
const router = express.Router();
const componentInventoryController = require("../controllers/component-inventory.controller");
const {
  validateUpdateComponentInventory,
} = require("../validators/component-inventory.validator");

// GET COMPONENT INVENTORY BY ID
router.get(
  "/:id_component/:id_warehouse",
  componentInventoryController.getInventoryById,
);

// UPDATE COMPONENT INVENTORY (MIN/MAX STOCK)
router.put(
  "/:id_component/:id_warehouse",
  validateUpdateComponentInventory,
  componentInventoryController.updateComponentInventory,
);

module.exports = router;
