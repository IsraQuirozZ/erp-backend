const prisma = require("../config/prisma");

// Items from an order managed in: supplier-order

// getSupplierOrderItemById -> Just for admin (debug)
const getSupplierOrderItemsById = async (id) => {
  const orderItems = await prisma.supplierOrderItem.findUnique({
    where: { id_supplier_order_item: id },
    include: { supplier_product: true },
  });

  if (!orderItems) {
    throw {
      status: 404,
      message: "Supplier Order Item not found",
    };
  }

  return orderItems;
};

// createSupplierOrderItem
// 1. @@unique ([id_supplier_order, id_supplier_product])
const createSupplierOrderItem = async (data) => {
  try {
    const supplierOrder = await prisma.supplierOrder.findUnique({
      where: { id_supplier_order: data.id_supplier_order },
    });

    if (!supplierOrder) {
      throw {
        status: 400,
        message: "The supplier order provided does not exist",
      };
    }

    if (supplierOrder.status !== "PENDING") {
      throw {
        status: 409,
        message: `Cannot add Order Item from the Order --${supplierOrder.id_supplier_order}--, status: ${supplierOrder.status}`,
      };
    }

    const supplierProduct = await prisma.supplierProduct.findUnique({
      where: { id_supplier_product: data.id_supplier_product },
    });

    if (!supplierProduct) {
      throw {
        status: 400,
        message: "The supplier product provided does not exist",
      };
    }

    // 1.
    if (supplierOrder.id_supplier !== supplierProduct.id_supplier) {
      throw {
        status: 400,
        message: "The product does not belong to the supplier of this order",
      };
    }

    data.unit_price = supplierProduct.purchase_price;
    data.subtotal = data.unit_price * data.quantity;

    const orderItem = await prisma.supplierOrderItem.create({
      data,
      include: { supplier_order: true, supplier_product: true }, // use supplier_ ... -> schema -> @references
    });

    // Recalculate Total
    await recalculateOrderTotal(data.id_supplier_order);

    return orderItem;
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "An order already has this supplier and supplier product",
      };
    }
    throw error;
  }
};

// Update if Products are updated && Order: PENDING
const updateSupplierOrderItemById = async (id, data) => {
  const orderItem = await prisma.supplierOrderItem.findUnique({
    where: { id_supplier_order_item: id },
    include: { supplier_product: true, supplier_order: true },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Supplier Order Item not found",
    };
  }

  const supplierProduct = await prisma.supplierProduct.findUnique({
    where: { id_supplier_product: orderItem.id_supplier_product },
  });

  // ORDER STATUS !== PENDING -> Can't update
  if (orderItem.supplier_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot update Order Item from the Order --${orderItem.supplier_order.id_supplier_order}--, status: ${orderItem.supplier_order.status}`,
    };
  }

  // Re-calculate subtotal
  const quantity =
    data.quantity !== undefined ? data.quantity : orderItem.quantity;

  const unitPrice = supplierProduct.purchase_price;

  const updatedItem = await prisma.supplierOrderItem.update({
    where: { id_supplier_order_item: id },
    data: {
      quantity,
      unit_price: unitPrice,
      subtotal: unitPrice * quantity,
    },
    include: { supplier_order: true, supplier_product: true },
  });

  // Recalculate Total
  await recalculateOrderTotal(updatedItem.id_supplier_order);

  return updatedItem;
};

const deleteSupplierOrderItemById = async (id) => {
  const orderItem = await prisma.supplierOrderItem.findUnique({
    where: { id_supplier_order_item: id },
    include: { supplier_order: true },
  });

  if (!orderItem) {
    throw {
      status: 400,
      message: "Supplier order item not found",
    };
  }

  // ORDER STATUS !== PENDING -> Can't delete
  if (orderItem.supplier_order.status !== "PENDING") {
    throw {
      status: 409,
      message: `Cannot delete Order Item from the Order --${orderItem.supplier_order.id_supplier_order}--, status: ${orderItem.supplier_order.status}`,
    };
  }

  const deletedItem = await prisma.supplierOrderItem.delete({
    where: { id_supplier_order_item: id },
    include: { supplier_product: true, supplier_order: true },
  });

  // Recalculate Total
  await recalculateOrderTotal(deletedItem.id_supplier_order);

  return deletedItem;
};

const recalculateOrderTotal = async (orderId) => {
  // Get all items
  items = await prisma.supplierOrderItem.findMany({
    where: { id_supplier_order: orderId },
    select: { subtotal: true },
  });

  // Calculate total
  const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  // Update supplier order total
  await prisma.supplierOrder.update({
    where: { id_supplier_order: orderId },
    data: { total },
  });
};

module.exports = {
  getSupplierOrderItemsById,
  createSupplierOrderItem,
  updateSupplierOrderItemById,
  deleteSupplierOrderItemById,
};
