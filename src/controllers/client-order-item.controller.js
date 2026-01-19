const clientOrderItemService = require("../services/client-order-item.service");

const getClientrOrderItemsById = async (req, res, next) => {
  try {
    const id_client_order = Number(req.params.id_client_order);
    const id_product = Number(req.params.id_product);
    const orderItems = await clientOrderItemService.getClientrOrderItemsById(
      id_client_order,
      id_product,
    );
    res.json(orderItems);
  } catch (error) {
    next(error);
  }
};

const createClientOrderItem = async (req, res, next) => {
  try {
    const orderItem = await clientOrderItemService.createClientOrderItem(
      req.body,
    );
    res.json(orderItem);
  } catch (error) {
    next(error);
  }
};

const updateClientOrderItemById = async (req, res, next) => {
  try {
    const id_client_order = Number(req.params.id_client_order);
    const id_product = Number(req.params.id_product);
    const orderItem = await clientOrderItemService.updateClientOrderItemById(
      id_client_order,
      id_product,
      req.body,
    );
    res.json(orderItem);
  } catch (error) {
    next(error);
  }
};

const deleteClientOrderItemById = async (req, res, next) => {
  try {
    const id_client_order = Number(req.params.id_client_order);
    const id_product = Number(req.params.id_product);
    const orderItem = await clientOrderItemService.deleteClientOrderItemById(
      id_client_order,
      id_product,
    );
    res.json({
      message: `Client Order Item -- (${orderItem.id_client_order}, ${orderItem.id_product}) --  successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClientrOrderItemsById,
  createClientOrderItem,
  updateClientOrderItemById,
  deleteClientOrderItemById,
};
