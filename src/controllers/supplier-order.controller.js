const supplierOrderService = require("../services/supplier-order.service");

const getAllSupplierOrders = async (req, res, next) => {
  try {
    const orders = await supplierOrderService.getAllSupplierOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getSupplierOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await supplierOrderService.getSupplierOrderById(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const createSupplierOrder = async (req, res, next) => {
  try {
    const order = await supplierOrderService.createSupplierOrder(req.body);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSupplierOrders,
  getSupplierOrderById,
  createSupplierOrder,
};
