const warehouseService = require("../services/warehouse.service");

const getAllWarehouses = async (req, res, next) => {
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

    const [warehouses, total] = await Promise.all([
      warehouseService.getAllWarehouses({ skip, take: limit, where, orderBy }),
      warehouseService.countWarehouses(where), // Count total warehouses
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ data: warehouses, page, pages, total });
  } catch (error) {
    next(error);
  }
};

const getWarehouseById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const warehouse = await warehouseService.getWarehouseById(id);
    res.json(warehouse);
  } catch (error) {
    next(error);
  }
};

// GET INVENTORY BY WAREHOUSE ID
const getInventoryByWarehouseId = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sort by component name
    const sort = req.query.sort || "component.name";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "component.name") orderBy = [{ component: { name: order } }];

    const id = Number(req.params.id);
    const [inventory, total] = await Promise.all([
      warehouseService.getInventoryByWarehouseId(id, {
        skip,
        take: limit,
        orderBy,
      }),
      warehouseService.countComponentsInWarehouse(id), // Count total components in this warehouse
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ data: inventory, page, pages, total });
  } catch (error) {
    next(error);
  }
};

const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.createWarehouse(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    next(error);
  }
};

const updateWarehouseById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const warehouse = await warehouseService.updateWarehouseById(id, req.body);
    res.json(warehouse);
  } catch (error) {
    next(error);
  }
};

const deleteWarehouseById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const warehouse = await warehouseService.deleteWarehouseById(id);
    res.json({
      message: `Warehouse (${warehouse.name}) ${warehouse.active ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  getInventoryByWarehouseId,
  createWarehouse,
  updateWarehouseById,
  deleteWarehouseById,
};
