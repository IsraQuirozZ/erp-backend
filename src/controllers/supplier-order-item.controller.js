const supplierOrderItemService = require("../services/supplier-order-item.service");

// GET ITEMS BY SUPPLIER ORDER
const getItemsBySupplierOrder = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const id = Number(req.params.id);
    const sort = req.query.sort || "component.name";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "component.name") orderBy = [{ component: { name: order } }];

    const [items, total] = await Promise.all([
      supplierOrderItemService.getItemsBySupplierOrder(id, {
        skip,
        take: limit,
        orderBy,
      }),
      supplierOrderItemService.countItemsBySupplierOrder(id),
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ data: items, page, pages, total });
  } catch (error) {
    next(error);
  }
};

const getSupplierOrderItemsById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const orderItems =
      await supplierOrderItemService.getSupplierOrderItemsById(id);
    res.json(orderItems);
  } catch (error) {
    next(error);
  }
};

// CREATE (UPSERT)
const createSupplierOrderItem = async (req, res, next) => {
  try {
    const orderItem = await supplierOrderItemService.createSupplierOrderItem(
      req.body,
    );
    res.json(orderItem);
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateSupplierOrderItemById = async (req, res, next) => {
  try {
    const id_supplier_order = Number(req.params.id_supplier_order);
    const id_component = Number(req.params.id_component);
    const orderItem =
      await supplierOrderItemService.updateSupplierOrderItemById(
        id_supplier_order,
        id_component,
        req.body,
      );
    res.json(orderItem);
  } catch (error) {
    next(error);
  }
};

const deleteSupplierOrderItemById = async (req, res, next) => {
  try {
    const id_supplier_order = Number(req.params.id_supplier_order);
    const id_component = Number(req.params.id_component);
    const orderItem =
      await supplierOrderItemService.deleteSupplierOrderItemById({
        id_supplier_order,
        id_component,
      });
    res.json({
      message: `"${orderItem.component.name}" successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItemsBySupplierOrder,
  getSupplierOrderItemsById,
  createSupplierOrderItem,
  updateSupplierOrderItemById,
  deleteSupplierOrderItemById,
};
