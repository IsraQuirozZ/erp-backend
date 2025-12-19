const prisma = require("../config/prisma");

const getAllDirecciones = async () => {
  return prisma.direccion.findMany({
    orderBy: {
      calle: "asc",
    },
    include: {
      provincia: true,
    },
  });
};

const getDireccionById = async (id) => {
  const direccion = await prisma.direccion.findUnique({
    where: { id_direccion: id },
    include: {
      provincia: true,
    },
  });

  if (!direccion) {
    throw {
      status: 404,
      message: `Dirección con id: ${id} no encontrada`,
    };
  }

  return direccion;
};

const createDireccion = async (data) => {
  const provincia = await prisma.provincia.findUnique({
    where: { id_provincia: data.id_provincia },
  });

  if (!provincia) {
    throw {
      status: 400,
      message: "La provincia indicada no existe",
    };
  }

  return prisma.direccion.create({
    data,
  });
};

const updateDireccion = async (id, data) => {
  const direccion = await prisma.direccion.findUnique({
    where: { id_direccion: id },
  });

  if (!direccion) {
    throw {
      status: 404,
      message: "Dirección no encontrada",
    };
  }

  // Si se quiere cambiar la provincia
  if (data.id_provincia) {
    const provincia = await prisma.provincia.findUnique({
      where: { id_provincia: data.id_provincia },
    });

    if (!provincia) {
      throw {
        status: 400,
        message: "La provincia indicada no existe",
      };
    }
  }

  return prisma.direccion.update({
    where: { id_direccion: id },
    data: data,
  });
};

const deleteDireccion = async (id) => {
  const direccion = await prisma.direccion.findUnique({
    where: { id_direccion: id },
  });

  if (!direccion) {
    throw {
      status: 404,
      message: `Dirección con id "${id}" con encontrada`,
    };
  }

  await prisma.direccion.delete({
    where: { id_direccion: id },
  });

  return direccion;
};

module.exports = {
  getAllDirecciones,
  getDireccionById,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};
