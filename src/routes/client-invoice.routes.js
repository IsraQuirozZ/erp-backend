const express = require("express");
const router = express.Router();
const clientInvoiceController = require("../controllers/client-invoice.controller");
const {
  validateUpdateClientInvoice,
} = require("../validators/client-invoice.validator");

// updateClientInvoiceById
router.put(
  "/:id_client_invoice",
  validateUpdateClientInvoice,
  clientInvoiceController.updateClientInvoiceById,
);

module.exports = router;
