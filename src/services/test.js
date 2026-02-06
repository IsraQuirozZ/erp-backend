// createSupplierOrderItem
// 1. @@unique ([id_supplier_order, id_component])
const createSupplierOrderItem = async (data) => {
  try {
    let supplierOrder;
    // Si no viene id_supplier_order, crear una nueva orden
    if (!data.id_supplier_order) {
      if (!data.id_supplier) {
        throw {
          status: 400,
          message: "Missing id_supplier to create a new order",
        };
      }
      supplierOrder = await prisma.supplierOrder.create({
        data: {
          id_supplier: data.id_supplier,
          status: "PENDING",
          total: 0,
          active: true,
        },
      });
      data.id_supplier_order = supplierOrder.id_supplier_order;
    } else {
      supplierOrder = await prisma.supplierOrder.findUnique({
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
          message: `Cannot add Order Item from the Order (#${supplierOrder.id_supplier_order}), status: ${supplierOrder.status}`,
        };
      }
    }

    // Buscar el producto del proveedor
    const component = await prisma.component.findUnique({
      where: { id_supplier_product: data.id_supplier_product },
    });
    if (!component) {
      throw {
        status: 400,
        message: "The supplier product provided does not exist",
      };
    }
    // Validar que el producto pertenezca al proveedor de la orden
    if (supplierOrder.id_supplier !== component.id_supplier) {
      throw {
        status: 400,
        message: "The product does not belong to the supplier of this order",
      };
    }

    // Calcular unit_price y subtotal
    data.unit_price = component.price;
    data.subtotal = data.unit_price * data.quantity;

    // Manejar taxes y discounts opcionales
    if (data.taxes) {
      data.subtotal += Number(data.taxes);
    }
    if (data.discounts) {
      data.subtotal -= Number(data.discounts);
    }

    // Validar campos obligatorios
    if (!data.quantity || !data.unit_price || !data.id_component) {
      throw {
        status: 400,
        message: "Missing required fields: quantity, unit_price, id_component",
      };
    }

    const orderItem = await prisma.supplierOrderItem.create({
      data,
      include: { supplier_order: true, supplier_product: true },
    });

    // Recalcular el total de la orden
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
