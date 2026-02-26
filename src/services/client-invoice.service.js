const prisma = require("../config/prisma");

// UPDATE INVOICE
const updateClientInvoiceById = async (id, newStatus) => {
  const invoice = await prisma.clientInvoice.findUnique({
    where: { id_client_invoice: id },
  });

  if (!invoice) {
    throw {
      status: 404,
      message: "Client Invoice not found",
    };
  }

  if (invoice.status === newStatus) {
    throw {
      status: 409,
      message: "Invoice already in this status",
    };
  }

  const validTransitions = {
    DRAFT: ["ISSUED", "CANCELLED"],
    ISSUED: ["PAID", "CANCELLED"],
    CANCELLED: [],
    PAID: [],
  };

  const allowed = validTransitions[invoice.status] || [];

  if (!allowed.includes(newStatus)) {
    throw {
      status: 409,
      message: `Cannot change status from ${invoice.status} to ${newStatus}`,
    };
  }

  return await prisma.clientInvoice.update({
    where: { id_client_invoice: id },
    data: { status: newStatus },
  });
};

module.exports = {
  updateClientInvoiceById,
};
