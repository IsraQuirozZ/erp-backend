const supplierService = require("../services/supplier.service");

const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await supplierService.getSupplierById(id);
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

// getproductsBySupplierId
const getProductsBySupplierId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const products = await supplierService.getProductsBySupplierId(id);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// getOrdersBySupplierId
const getOrdersBySupplierId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const orders = await supplierService.getOrdersBySupplierId(id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

// USE CASE
const createFullSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.createFullSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

const updateSupplierById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await supplierService.updateSupplierById(id, req.body);
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

// Soft Delete
const deleteSupplierById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await supplierService.deleteSupplierById(id);
    res.json({
      message: `Supplier --${supplier.name}-- with ID ${supplier.id_supplier} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  getProductsBySupplierId,
  getOrdersBySupplierId,
  createSupplier,
  createFullSupplier, // USE CASE
  updateSupplierById,
  deleteSupplierById,
};
