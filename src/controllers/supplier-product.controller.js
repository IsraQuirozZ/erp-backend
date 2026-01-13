const supplierProductService = require("../services/supplier-product.service");

const getAllSupplierProducts = async (req, res, next) => {
  try {
    const products = await supplierProductService.getAllSupplierProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getSupplierProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await supplierProductService.getSupplierProductById(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createSupplierProduct = async (req, res, next) => {
  try {
    const product = await supplierProductService.createSupplierProduct(
      req.body
    );
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const updateSupplierProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await supplierProductService.updateSupplierProductById(
      id,
      req.body
    );
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Soft Delete -> active: false
const deleteSupplierProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await supplierProductService.deleteSupplierProductById(id);
    res.json({
      message: `Supplier Product --${product.name}-- with ID ${product.id_supplier_product} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSupplierProducts,
  getSupplierProductById,
  createSupplierProduct,
  updateSupplierProductById,
  deleteSupplierProductById,
};
