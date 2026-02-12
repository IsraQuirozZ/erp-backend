const express = require("express");
const router = express.Router();
const supplierInvoiceController = require("../controllers/supplier-invoice.controller");
const {
  validateCreateSupplierInvoice,
  validateUpdateSupplierInvoice,
} = require("../validators/supplier-invoice.validator");

// GET ALL INVOICES
router.get("/", supplierInvoiceController.getAllSupplierInvoices);

// GET INVOICE BY ID
router.get(
  "/:id_supplier_invoice",
  supplierInvoiceController.getSupplierInvoiceById,
);

// GET INVOICE BY ORDER ID
router.get(
  "/:id_supplier_order/order",
  supplierInvoiceController.getInvoiceByOrderId,
);

// CREATE INVOICE -> ORDER === RECEIVED
router.post(
  "/",
  validateCreateSupplierInvoice,
  supplierInvoiceController.createSupplierInvoice,
);

// UPDATE INVOICE BY ID -> ONLY STATUS
router.put(
  "/:id_supplier_invoice",
  validateUpdateSupplierInvoice,
  supplierInvoiceController.updateSupplierIoviceById,
);

module.exports = router;
