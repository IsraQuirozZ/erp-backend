// UPDATE SUPPLIER ORDER -> If Transaction RECEIVED -> Create movements in inventory, create/update componentInventory
const updateSupplierOrderById = async (id, data) => {
  const order = await prisma.supplierOrder.findUnique({
    where: { id_supplier_order: id },
  });

  if (!order) {
    throw {
      status: 404,
      message: "Supplier Order not found",
    };
  }

  // If status: RECEIVED -> NO UPDATES ALLOWED
  if (order.status === "RECEIVED") {
    throw {
      status: 409,
      message: "A received order cannot be modified",
    };
  }

  // Status transition rules
  if (data.status) {
    const validTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["RECEIVED"],
      CANCELLED: [],
    };

    const allowed = validTransitions[order.status] || [];

    if (!allowed.includes(data.status)) {
      throw {
        status: 409,
        message: `Cannot change status from ${order.status} to ${data.status}`,
      };
    }
  }

  if (order.status === "PENDING" && data.status === "CONFIRMED") {
    const estimatedDays = 5;
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + estimatedDays);
    data.expected_delivery_date = expectedDate;
  }

  if (order.status === "CONFIRMED" && data.status === "RECEIVED") {
    data.delivery_at = new Date();
  }

  if (order.status === "CANCELLED") {
    data.expected_delivery_date = order.expected_delivery_date;
  }

  return await prisma.supplierOrder.update({
    where: { id_supplier_order: id },
    data,
    include: {
      supplier: true,
    },
  });
};
