const clientOrderService = require("../services/client-order.service");

const getAllClientOrders = async (req, res, next) => {
  try {
    const orders = await clientOrderService.getAllClientOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getClientOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await clientOrderService.getClientOrderById(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// getItemsBySupplierOrder
const getItemsByClientOrder = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const orderItems = await clientOrderService.getItemsByClientOrder(orderId);
    res.json(orderItems);
  } catch (error) {
    next(error);
  }
};

const createClientOrder = async (req, res, next) => {
  try {
    const order = await clientOrderService.createClientOrder(req.body);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateClientOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await clientOrderService.updateClientOrderById(id, req.body);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const cancelClientOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await clientOrderService.cancelClientOrderById(id);
    res.json({
      message: `Supplier Order --${order.id_client_order}--  successfully cancelled`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClientOrders,
  getClientOrderById,
  getItemsByClientOrder,
  createClientOrder,
  updateClientOrderById,
  cancelClientOrderById,
};
