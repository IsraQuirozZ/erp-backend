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

const updateSupplierOrderItemById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const orderItem =
      await supplierOrderItemService.updateSupplierOrderItemById(id, req.body);
    res.json(orderItem);
  } catch (error) {
    next(error);
  }
};

const deleteSupplierOrderitemById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const orderItem = supplierOrderItemService.deleteSupplierOrderItemById(id);
    res.json({
      message: `Supplier Order Item --${
        (await orderItem).id_supplier_order_item
      }--  successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSupplierOrderItemsById,
  createSupplierOrderItem,
  updateSupplierOrderItemById,
  deleteSupplierOrderitemById,
};
