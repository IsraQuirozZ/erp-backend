const supplierService = require("../services/supplier.service");

const getSuppliers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status || "active";

    let where = {};

    // Status filter
    if (status === "active") where.active = true;
    if (status === "inactive") where.active = false;

    // Sort by name
    const sort = req.query.sort || "name";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "name") orderBy = [{ name: order }];

    const [suppliers, total] = await Promise.all([
      supplierService.getAllSuppliers({ skip, take: limit, where, orderBy }),
      supplierService.countSuppliers(where), // Count total suppliers
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ data: suppliers, page, pages, total });
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

// USE CASE
const updateFullSupplier = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const supplier = await supplierService.updateFullSupplier(id, req.body);
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
  getOrdersBySupplierId,
  createSupplier,
  createFullSupplier, // USE CASE
  updateSupplierById,
  updateFullSupplier, // USE CASE
  deleteSupplierById,
};
