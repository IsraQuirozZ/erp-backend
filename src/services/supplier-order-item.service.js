const prisma = require("../config/prisma");

// Items from an order managed in: supplier-order

// getSupplierIrderItemById -> Just for admin (debug)
const getSupplierOrderItemsById = async (id) => {
  const orderItems = await prisma.supplierOrderItem.findUnique({
    where: { id_supplier_order_item: id },
    include: { supplier_product: true },
  });

  if (!orderItems) {
    throw {
      status: 404,
      message: "Supplier Order Items not found",
    };
  }

  return orderItems;
};

// createSupplierOrderItem
// @@unique ([id_supplier_order, id_supplier_product])
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

    const supplierProduct = await prisma.supplierProduct.findUnique({
      where: { id_supplier_product: data.id_supplier_product },
    });

    if (!supplierProduct) {
      throw {
        status: 400,
        message: "The supplier product provided does not exist",
      };
    }

    if (supplierOrder.id_supplier !== supplierProduct.id_supplier) {
      throw {
        status: 400,
        message: "The product does not belong to the supplier of this order",
      };
    }

    data.unit_price = supplierProduct.purchase_price;
    data.subtotal = data.unit_price * data.quantity;

    return await prisma.supplierOrderItem.create({
      data: data,
      include: { supplier_order: true, supplier_product: true }, // use supplier_ ... -> schema @references
    });
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

module.exports = { getSupplierOrderItemsById, createSupplierOrderItem };
