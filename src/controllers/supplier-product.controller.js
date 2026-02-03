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

const getComponentsBySupplierId = async (req, res, next) => {
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

    const [components, total] = await Promise.all([
      supplierProductService.getComponentsBySupplierId(Number(req.params.id), {
        skip,
        take: limit,
        where,
        orderBy,
      }),
      supplierProductService.countComponents(where), // Count total components
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ data: components, page, pages, total });
  } catch (error) {
    next(error);
  }
};

const createSupplierProduct = async (req, res, next) => {
  try {
    const product = await supplierProductService.createSupplierProduct(
      req.body,
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
      req.body,
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
  getComponentsBySupplierId,
  createSupplierProduct,
  updateSupplierProductById,
  deleteSupplierProductById,
};
