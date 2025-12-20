const prisma = require("../config/prisma");

const getAllClientes = async () => {
  return prisma.cliente.findMany({
    orderBy: {
      nombre: "asc",
    },
    include: { direccion: true },
  });
};

const getClienteById = async (id) => {
  const cliente = await prisma.cliente.findUnique({
    where: { id_cliente: id },
    include: { direccion: true },
  });

  if (!cliente) {
    throw {
      status: 404,
      message: `Cliente con el id: ${id} no encontrado`,
    };
  }

  return cliente;
};

const createCliente = async (data) => {
  try {
    const direccion = await prisma.direccion.findUnique({
      where: { id_direccion: data.id_direccion },
    });

    if (!direccion) {
      throw {
        status: 400,
        message: "La dirección indicada no existe",
      };
    }

    return await prisma.cliente.create({
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: `Ya existe un Cliente con este email: ${data.email}`,
      };
    }

    throw error;
  }
};

const updateCliente = async (id, data) => {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: id },
    });

    if (!cliente) {
      throw {
        status: 404,
        message: `Cliente no encontrado`,
      };
    }

    if (data.id_direccion !== undefined) {
      const direccion = await prisma.direccion.findUnique({
        where: { id_direccion: data.id_direccion },
      });

      if (!direccion) {
        throw {
          status: 400,
          message: "La direccion indicada no existe",
        };
      }
    }

    return await prisma.cliente.update({
      where: { id_cliente: id },
      data: data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: `Ya existe un Cliente con este email: ${data.email}`,
      };
    }

    throw error;
  }
};

const deleteCliente = async (id) => {
  const cliente = await prisma.cliente.findUnique({
    where: { id_cliente: id },
  });

  if (!cliente) {
    throw {
      status: 404,
      message: "Cliente no fue encontrado",
    };
  }

  await prisma.cliente.delete({
    where: { id_cliente: id },
  });

  return cliente;
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
