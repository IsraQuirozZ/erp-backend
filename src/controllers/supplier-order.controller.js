const supplierOrderService = require("../services/supplier-order.service");
const supplierOrderItemService = require("../services/supplier-order-item.service");

const getAllSupplierOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status || "all";

    let where = {};

    // Status filter
    if (status === "pending") where.status = "PENDING";
    if (status === "confirmed") where.status = "CONFIRMED";
    if (status === "received") where.status = "RECEIVED";
    if (status === "cancelled") where.status = "CANCELLED";

    // Sort by created_at
    const sort = req.query.sort || "created_at";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "created_at") orderBy = [{ created_at: order }];

    const [orders, total] = await Promise.all([
      supplierOrderService.getAllSupplierOrders({
        skip,
        take: limit,
        where,
        orderBy,
      }),
      supplierOrderService.countOrders(where), // Count total orders
    ]);

    const ordersWithCounts = await Promise.all(
      orders.map(async (order) => {
        const items = await supplierOrderItemService.getItemsBySupplierOrder(
          order.id_supplier_order,
        );
        return { ...order, totalProducts: items.length };
      }),
    );

    const pages = Math.ceil(total / limit);
    res.json({ data: ordersWithCounts, page, pages, total });
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

const updateSupplierOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await supplierOrderService.updateSupplierOrderById(
      id,
      req.body,
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
    res.json({
      message: `Supplier Order --${order.id_supplier_order}--  successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSupplierOrders,
  getSupplierOrderById,
  createSupplierOrder,
  updateSupplierOrderById,
  deleteSupplierOrderById,
};
