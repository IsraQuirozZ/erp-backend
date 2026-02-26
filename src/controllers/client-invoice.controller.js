const clientInvoiceService = require("../services/client-invoice.service");

// UPDATE INVOICE BY ID -> ONLY STATUS
const updateClientInvoiceById = async (req, res, next) => {
  try {
    const id_client_invoice = Number(req.params.id_client_invoice);
    const invoice = await clientInvoiceService.updateClientInvoiceById(
      id_client_invoice,
      req.body.status,
    );
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateClientInvoiceById,
};
