const productService = require("../services/product.service");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.updateProductById(id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.deleteProductById(id);
    res.json({
      message: `Product --${product.name}-- with ID: ${product.id_product} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
