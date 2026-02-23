const clientOrderItemService = require("../services/client-order-item.service");

// getItemsByClientOrder
const getItemsByClientOrder = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const id = Number(req.params.id);
    const sort = req.query.sort || "product.name";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "product.name") orderBy = [{ product: { name: order } }];

    const [items, total] = await Promise.all([
      clientOrderItemService.getItemsByClientOrder(id, {
        skip,
        take: limit,
        orderBy,
      }),
      clientOrderItemService.countItemsByClientOrder(id),
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ data: items, page, pages, total });
  } catch (error) {
    next(error);
  }
};

// CREATE (UPSERT)
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

// UPDATE
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
  getItemsByClientOrder,
  createClientOrderItem,
  updateClientOrderItemById,
  deleteClientOrderItemById,
};
