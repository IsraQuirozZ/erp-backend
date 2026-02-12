const prisma = require("../config/prisma");

// GET ALL INVOICES
const getAllSupplierInvoices = async () => {
  return await prisma.supplierInvoice.findMany({
    include: {
      supplier_order: true,
      supplier: { select: { name: true } },
    },
  });
};

// GET INVOICE BY ID
const getSupplierInvoiceById = async (id_supplier_invoice) => {
  const invoice = await prisma.supplierInvoice.findUnique({
    where: { id_supplier_invoice },
    include: {
      supplier_order: true,
      supplier: { select: { name: true } },
    },
  });

  if (!invoice) {
    throw {
      status: 404,
      message: "The supplier invoice provided does not exist",
    };
  }

  return invoice;
};

// GET INVOICE BY ORDER ID
const getInvoiceByOrderId = async (id_supplier_order) => {
  const invoices = await prisma.supplierInvoice.findMany({
    where: { id_supplier_order },
    orderBy: { created_at: "desc" },
    include: { supplier_order: true, supplier: { select: { name: true } } },
  });

  if (!invoices || invoices.length === 0)
    throw {
      status: 404,
      message: "No supplier invoice found for the provided order ID",
    };

  // Find the first invoice that is NOT cancelled
  const notCancelled = invoices.find((inv) => inv.status !== "CANCELLED");
  if (notCancelled) return notCancelled;

  // If all are cancelled, return the most recent one
  return invoices[0];
};

// CREATE INVOICE -> ORDER === RECEIVED
const createSupplierInvoice = async (id_supplier_order) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.supplierOrder.findUnique({
      where: { id_supplier_order },
      include: { supplier: true },
    });

    if (!order) {
      throw {
        status: 404,
        message: "The supplier order provided does not exist",
      };
    }

    if (order.status !== "RECEIVED") {
      throw {
        status: 400,
        message: "The supplier order must be RECEIVED to create an invoice",
      };
    }

    const existingInvoice = await tx.supplierInvoice.findFirst({
      where: { id_supplier_order },
    });

    if (existingInvoice && existingInvoice.status !== "CANCELLED") {
      throw {
        status: 400,
        message: "An invoice for this supplier order already exists",
      };
    }

    const date = new Date();
    const year = date.getFullYear();

    const lastInvoice = await tx.supplierInvoice.findFirst({
      where: {
        invoice_number: {
          startsWith: `SUP-${year}-`,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    let newInvoiceNumber;

    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoice_number.split("-")[2]);
      newInvoiceNumber = `SUP-${year}-${String(lastNumber + 1).padStart(4, "0")}`;
    } else {
      newInvoiceNumber = `SUP-${year}-0001`;
    }

    return await tx.supplierInvoice.create({
      data: {
        id_supplier_order,
        invoice_number: newInvoiceNumber,
        invoice_date: new Date(),
        total: order.total,
        status: "DRAFT",
        id_supplier: order.id_supplier,
      },
    });
  });
};

// UPDATE INVOICE  (DRAFT -> ISSUED -> PAID, ISSUED -> CANCELLED)
const updateSupplierIoviceById = async (id, newStatus) => {
  const invoice = await prisma.supplierInvoice.findUnique({
    where: { id_supplier_invoice: id },
  });

  if (!invoice) {
    throw {
      status: 404,
      message: "Supplier Invoice not found",
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

  return await prisma.supplierInvoice.update({
    where: { id_supplier_invoice: id },
    data: { status: newStatus },
  });
};

module.exports = {
  getAllSupplierInvoices,
  getSupplierInvoiceById,
  createSupplierInvoice,
  updateSupplierIoviceById,
  getInvoiceByOrderId,
};
