const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const {
  validateCreateAddress,
  validateUpdateAddress,
} = require("../validators/address.validator");

router.get("/", addressController.getAddresses);

router.get("/:id", addressController.getAddress);

router.post("/", validateCreateAddress, addressController.createAddress);

router.put("/:id", validateUpdateAddress, addressController.updateAddress);

router.delete("/:id", addressController.deleteAddress);

module.exports = router;
