const supplierProductService = require("../services/supplier-product.service");

const getAllSupplierProducts = async (req, res, next) => {
  try {
    const products = await supplierProductService.getAllSupplierProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getComponentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const component = await supplierProductService.getComponentById(id);
    res.json(component);
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

const updateComponentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const component = await supplierProductService.updateComponentById(
      id,
      req.body,
    );
    res.json(component);
  } catch (error) {
    next(error);
  }
};

// Soft Delete -> active: false
const deleteComponentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await supplierProductService.deleteComponentById(id);
    res.json({
      message: `Product: (${product.name}) ${product.active ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSupplierProducts,
  getComponentById,
  getComponentsBySupplierId,
  createSupplierProduct,
  updateComponentById,
  deleteComponentById,
};
