const clientOrderService = require("../services/client-order.service");
const clientOrderItemService = require("../services/client-order-item.service");

// getAllClientOrders
const getAllClientOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status || "all";

    let where = {};

    // Status filter
    if (status === "pending") where.status = "PENDING";
    if (status === "confirmed") where.status = "CONFIRMED";
    if (status === "delivered") where.status = "DELIVERED";
    if (status === "cancelled") where.status = "CANCELLED";

    // Sort by created_at
    const sort = req.query.sort || "created_at";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "created_at") orderBy = [{ created_at: order }];

    const [orders, total] = await Promise.all([
      clientOrderService.getAllClientOrders({
        skip,
        take: limit,
        where,
        orderBy,
      }),
      clientOrderService.countOrders(where), // Count total orders
    ]);

    const ordersWithCounts = await Promise.all(
      orders.map(async (order) => {
        const items = await clientOrderItemService.getItemsByClientOrder(
          order.id_client_order,
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

// getClientOrderById
const getClientOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await clientOrderService.getClientOrderById(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// createClientOrder
const createClientOrder = async (req, res, next) => {
  try {
    const order = await clientOrderService.createClientOrder(req.body);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// updateClientOrderById
const updateClientOrderById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const order = await clientOrderService.updateClientOrderById(id, status);
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
      message: `Client Order --${order.id_client_order}--  successfully cancelled`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClientOrders,
  getClientOrderById,
  createClientOrder,
  updateClientOrderById,
  cancelClientOrderById,
};
