const productService = require("../services/product.service");

// GET ALL PRODUCTS WITH PAGINATION, FILTERING AND SORTING
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status || "active";

    let where = {};

    // Status filter
    if (status == "active") where.active = true;
    if (status == "inactive") where.active = false;

    // Sort by name
    const sort = req.query.sort || "name";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "name") orderBy = [{ name: order }];

    const [products, total] = await Promise.all([
      productService.getAllProducts({ skip, take: limit, where, orderBy }),
      productService.countProducts(where), // Count total products
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ data: products, page, pages, total });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// CREATE PRODUCT
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
      message: `Product: (${product.name}) ${product.active ? "activated" : "deactivated"} successfully`,
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
