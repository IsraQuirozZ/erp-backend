const prisma = require("../config/prisma");

const getAllClients = async () => {
  return prisma.client.findMany({
    where: { active: true },
    orderBy: {
      firstName: "asc",
    },
    include: { address: true },
  });
};

const getClientById = async (id) => {
  const client = await prisma.client.findUnique({
    where: { id_client: id },
    include: { address: true },
  });

  if (!client) {
    throw {
      status: 404,
      message: `Client not found`,
    };
  }

  return client;
};

const createClient = async (data) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id_address: data.id_address },
    });

    if (!address) {
      throw {
        status: 400,
        message: "The address provided does not exist",
      };
    }

    return await prisma.client.create({
      data,
      include: { address: true },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: `A client with this email already exists`,
      };
    }

    throw error;
  }
};

const updateClient = async (id, data) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id_client: id },
    });

    if (!client) {
      throw {
        status: 404,
        message: `Client not found`,
      };
    }

    if (data.id_address !== undefined) {
      const address = await prisma.address.findUnique({
        where: { id_address: data.id_address },
      });

      if (!address) {
        throw {
          status: 400,
          message: "The address provided does not exist",
        };
      }
    }

    return await prisma.client.update({
      where: { id_client: id },
      include: { address: true },
      data: data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: `A client with this email already exists`,
      };
    }

    throw error;
  }
};

// SOFT DELETE
// RULE FOR THE FUTURE --> Can not be deleted if it has associated records (orders,payments, invoices... etc)
const deleteClientById = async (id) => {
  const client = await prisma.client.findUnique({
    where: { id_client: id },
  });

  if (!client) {
    throw {
      status: 404,
      message: "Client not found",
    };
  }

  return await prisma.client.update({
    where: { id_client: id },
    include: { address: true },
    data: { active: false },
  });
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClientById,
};
