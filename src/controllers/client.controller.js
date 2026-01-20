const clientService = require("../services/client.service");

const getClients = async (req, res, next) => {
  try {
    const clients = await clientService.getAllClients();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

const getClient = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const client = await clientService.getClientById(id);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

// USE CASE
const createFullClient = async (req, res, next) => {
  try {
    const client = await clientService.createFullClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const client = await clientService.updateClient(id, req.body);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

// USE CASE
const updateFullClient = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const client = await clientService.updateFullClient(id, req.body);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

const deleteClientById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const client = await clientService.deleteClientById(id);
    res.json({
      message: `Client --${client.firstName} ${client.lastName}-- With ID ${client.id_client} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  createFullClient, // USE CASE
  updateClient,
  updateFullClient, // USE CASE
  deleteClientById,
};
