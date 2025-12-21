const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const { validateCreateSupplier } = require("../validators/supplier.validator");

router.get("/", supplierController.getSuppliers);
router.get("/:id", supplierController.getSupplier);
router.post("/", validateCreateSupplier, supplierController.createSupplier);

module.exports = router;
