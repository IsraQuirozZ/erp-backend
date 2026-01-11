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

// getItemsBySupplierOrder
const getItemsBySupplierOrder = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const orderItems = await supplierOrderService.getItemsBySupplierOrder(
      orderId
    );
    res.json(orderItems);
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

const updateSupplierOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await supplierOrderService.updateSupplierOrderById(
      id,
      req.body
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const deleteSupplierOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await supplierOrderService.deleteSupplierOrderById(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSupplierOrders,
  getSupplierOrderById,
  getItemsBySupplierOrder,
  createSupplierOrder,
  updateSupplierOrderById,
  deleteSupplierOrderById,
};
