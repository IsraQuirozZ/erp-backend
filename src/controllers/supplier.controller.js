const prisma = require("../config/prisma");
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

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await supplierService.updateSupplier(id, req.body);
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await supplierService.deleteSupplier(id);
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
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
