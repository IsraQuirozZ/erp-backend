const supplierInvoiceService = require("../services/supplier-invoices.service");

// GET ALL INVOICES
const getAllSupplierInvoices = async (req, res, next) => {
  try {
    const invoices = await supplierInvoiceService.getAllSupplierInvoices();
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

// GET INVOICE BY ID
const getSupplierInvoiceById = async (req, res, next) => {
  try {
    const id_supplier_invoice = Number(req.params.id_supplier_invoice);
    const invoice =
      await supplierInvoiceService.getSupplierInvoiceById(id_supplier_invoice);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

// GET INVOICE BY ORDER ID
const getInvoiceByOrderId = async (req, res, next) => {
  try {
    const id_supplier_order = Number(req.params.id_supplier_order);
    const invoice =
      await supplierInvoiceService.getInvoiceByOrderId(id_supplier_order);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

// CREATE INVOICE -> ORDER === RECEIVED
const createSupplierInvoice = async (req, res, next) => {
  try {
    const invoice = await supplierInvoiceService.createSupplierInvoice(
      req.body.id_supplier_order,
    );
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

// UPDATE INVOICE BY ID -> ONLY STATUS
const updateSupplierIoviceById = async (req, res, next) => {
  try {
    const id_supplier_invoice = Number(req.params.id_supplier_invoice);
    const invoice = await supplierInvoiceService.updateSupplierIoviceById(
      id_supplier_invoice,
      req.body.status,
    );
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSupplierInvoices,
  getSupplierInvoiceById,
  getInvoiceByOrderId,
  createSupplierInvoice,
  updateSupplierIoviceById,
};
