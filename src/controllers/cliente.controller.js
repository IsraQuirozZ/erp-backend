const clienteService = require("../services/cliente.service");

const getClientes = async (req, res, next) => {
  try {
    const clientes = await clienteService.getAllClientes();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const getCliente = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cliente = await clienteService.getClienteById(id);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const createCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.createCliente(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cliente = await clienteService.updateCliente(id, req.body);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const deleteCliente = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cliente = await clienteService.deleteCliente(id);
    res.json({
      message: `Cliente ${cliente.nombre} ${cliente.apellidos} con id: ${cliente.id_cliente} eliminado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
};
