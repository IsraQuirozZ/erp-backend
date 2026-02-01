const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");
const provinceService = require("../services/province.service");
const addressService = require("../services/address.service");

const getAllClients = async ({ skip, take, where, orderBy }) => {
  return await prisma.client.findMany({
    where: where || {},
    skip,
    take,
    orderBy: orderBy || { firstName: "asc", lastName: "asc" },
    include: { address: { include: { province: true } } },
    orderBy: { firstName: "asc" },
  });
};

// Count Clients
const countClients = async (where) => {
  return await prisma.client.count({
    where: where || {},
  });
};

const getClientById = async (id) => {
  const client = await prisma.client.findUnique({
    where: { id_client: id },
    include: { address: { include: { province: true } } },
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

// TODO: getoOrdersByClientId

// USE CASE
const createFullClient = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { client, address, province } = data;

      // PROVINCE --> provinceService
      let existingProvince = await provinceService.getProvinceByName(
        province.name,
        tx,
      );

      if (!existingProvince) {
        existingProvince = await provinceService.createProvince(province, tx);
      }

      // ADDRESS --> addresService
      const newAddress = await addressService.createAddress(
        { ...address, id_province: existingProvince.id_province },
        tx,
      );

      // CLIENT
      const newClient = await tx.client.create({
        data: {
          ...client,
          id_address: newAddress.id_address,
        },
        include: { address: true },
      });

      return newClient;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw {
        status: 400,
        message: "Client with this email already exists",
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

// USE CASE
const updateFullClient = async (id_client, data) => {
  const { client, address, province } = data;

  try {
    return await prisma.$transaction(async (tx) => {
      const existingClient = await tx.client.findUnique({
        where: { id_client },
        include: { address: true },
      });

      if (!existingClient) {
        throw {
          status: 404,
          message: "Client not found",
        };
      }

      let existingProvince = await tx.province.findFirst({
        where: { name: province.name },
      });

      if (!existingProvince) {
        existingProvince = await tx.province.create({
          data: { name: province.name },
        });
      }

      const updatedAddress = await tx.address.update({
        where: { id_address: existingClient.id_address },
        data: {
          ...address,
          id_province: existingProvince.id_province,
        },
      });

      const updatedClient = await tx.client.update({
        where: { id_client },
        data: {
          ...client,
        },
        include: {
          address: {
            include: {
              province: true,
            },
          },
        },
      });

      return updatedClient;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw {
        status: 400,
        message: "Client with this email already exists",
      };
    }

    throw error;
  }
};

// ACTIVATE/DEACTIVATE
// RULE FOR THE FUTURE --> Can not be deactivated if it has associated records (orders,payments, invoices... etc)
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

  if (!client.active) {
    return await prisma.client.update({
      where: { id_client: id },
      // include: { address: true },
      data: { active: true },
    });
  }

  return await prisma.client.update({
    where: { id_client: id },
    // include: { address: true },
    data: { active: false },
  });
};

module.exports = {
  getAllClients,
  countClients, // Count
  getClientById,
  createClient,
  createFullClient, // USE CASE
  updateClient,
  updateFullClient, // USE CASE
  deleteClientById,
};
