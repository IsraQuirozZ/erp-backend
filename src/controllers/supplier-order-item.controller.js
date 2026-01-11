const supplierOrderItemService = require("../services/supplier-order-item.service");

const getSupplierOrderItemsById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const orderItems = await supplierOrderItemService.getSupplierOrderItemsById(
      id
    );
    res.json(orderItems);
  } catch (error) {
    next(error);
  }
};

const createSupplierOrderItem = async (req, res, next) => {
  try {
    const orderItem = await supplierOrderItemService.createSupplierOrderItem(
      req.body
    );
    res.json(orderItem);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSupplierOrderItemsById, createSupplierOrderItem };
