const warehouseService = require("../services/warehouse.service");

const getAllWarehouses = async (req, res, next) => {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    res.json(warehouses);
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

const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.createWarehouse(req.body);
    res.json(warehouse);
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
      message: `Product --${warehouse.name}-- with ID: ${warehouse.id_warehouse} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouseById,
  deleteWarehouseById,
};
