const createSupplierOrderItem = async (data) => {
  try {
    const order = await prisma.supplierOrder.findUnique({
      where: { id_supplier_order: data.id_supplier_order },
    });

    if (!order) {
      throw {
        status: 400,
        message: "The supplier order provided does not exist",
      };
    }

    if (order.status !== "PENDING") {
      throw {
        status: 409,
        message: `Cannot add Items to order #${order.id_supplier_order} (status: ${order.status})`,
      };
    }

    const component = await prisma.component.findUnique({
      where: { id_component: data.id_component },
    });

    if (!component || component.active === false) {
      throw {
        status: 400,
        message: "The component provided does not exist or is not active",
      };
    }

    if (component.id_supplier !== order.id_supplier) {
      throw {
        status: 400,
        message: "The component does not belong to the supplier of this order",
      };
    }

    const existingItem = await prisma.supplierOrderItem.findUnique({
      where: {
        id_supplier_order_id_component: {
          id_supplier_order: data.id_supplier_order,
          id_component: data.id_component,
        },
      },
    });

    if (existingItem) {
      // Add quantity to existing item
      const newQuantity = existingItem.quantity + data.quantity;
      // Recalculate subtotal
      let subtotal = component.price * newQuantity;
      if (data.taxes) {
        subtotal += (Number(data.taxes) * subtotal) / 100;
      }
      if (data.discounts) {
        subtotal -= (Number(data.discounts) * subtotal) / 100;
      }

      const updatedItem = await prisma.supplierOrderItem.update({
        where: {
          id_supplier_order_id_component: {
            id_supplier_order: data.id_supplier_order,
            id_component: data.id_component,
          },
        },
        data: {
          quantity: newQuantity,
          unit_price: component.price,
          subtotal: subtotal,
        },
        include: { component: true, supplier_order: true },
      });

      await recalculateOrderTotal(updatedItem.id_supplier_order);
      return updatedItem;
    }

    // Prices
    let unit_price = component.price;
    let subtotal = unit_price * data.quantity;
    if (data.taxes) {
      subtotal += (Number(data.taxes) * subtotal) / 100;
    }
    if (data.discounts) {
      subtotal -= (Number(data.discounts) * subtotal) / 100;
    }

    data.unit_price = unit_price;
    data.subtotal = subtotal;

    const orderItem = await prisma.supplierOrderItem.create({
      data: {
        id_supplier_order: data.id_supplier_order,
        id_component: component.id_component,
        quantity: data.quantity,
        unit_price: unit_price,
        // taxes: data.taxes,
        // discounts: data.discounts,
        subtotal: subtotal,
      },
      include: { component: true, supplier_order: true },
    });

    await recalculateOrderTotal(orderItem.id_supplier_order);

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
