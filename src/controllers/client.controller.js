const clientService = require("../services/client.service");

const getClients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status || "active";

    let where = {};

    // Status filter
    if (status === "active") where.active = true;
    if (status === "inactive") where.active = false;

    // Sort by name
    const sort = req.query.sort || "name";
    const order = req.query.order === "desc" ? "desc" : "asc";
    let orderBy = [];
    if (sort === "name") orderBy = [{ firstName: order }, { lastName: order }];

    // TODO: Sort by created_at
    // if(sort === "created_at") orderBy = [{ created_at: order }];

    const [clients, total] = await Promise.all([
      clientService.getAllClients({ skip, take: limit, where, orderBy }),
      clientService.countClients(where), // Count total clients
    ]);

    const pages = Math.ceil(total / limit);

    res.json({ data: clients, page, pages, total });
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
