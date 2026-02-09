// Update if Products are updated && Order: PENDING
const updateSupplierOrderItemById = async (
  id_supplier_order,
  id_component,
  data,
) => {
  const supplierProduct = await prisma.supplierProduct.findUnique({
    where: { id_supplier_product: orderItem.id_supplier_product },
  });
  const orderItem = await prisma.supplierOrderItem.findUnique({
    where: {
      id_supplier_order_id_component: { id_supplier_order, id_component },
    },
    include: { supplier_product: true, supplier_order: true },
  });

  if (!orderItem) {
    throw {
      status: 404,
      message: "Supplier Order Item not found",
    };
  }

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
