const prisma = require("../config/prisma");

const getAllProvincias = async () => {
  return prisma.provincia.findMany({
    orderBy: {
      nombre: "asc",
    },
  });
};

const getProvinciaById = async (id) => {
  const provincia = await prisma.provincia.findUnique({
    where: { id_provincia: id },
  });

  if (!provincia) {
    throw {
      status: 404,
      message: "Provincia no encontrada",
    };
  }

  return provincia;
};

const createProvincia = async (data) => {
  try {
    return await prisma.provincia.create({
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "Ya existe una provincia con ese nombre",
      };
    }

    throw error;
  }
};

const updateProvincia = async (id, data) => {
  const provincia = await prisma.provincia.findUnique({
    where: { id_provincia: id },
  });

  if (!provincia) {
    throw {
      status: 404,
      message: "Provincia no encontrada",
    };
  }

  return prisma.provincia.update({
    where: { id_provincia: id },
    data,
  });
};

const deleteProvincia = async (id) => {
  // 1. Comprobar existencia
  const provincia = await prisma.provincia.findUnique({
    where: { id_provincia: id },
  });

  if (!provincia) {
    throw {
      status: 404,
      message: `Provincia con id ${id} no encontrada`,
    };
  }

  // 2. Comprobar direcciones asociadas
  const direccionesCount = await prisma.direccion.count({
    where: { id_provincia: id },
  });

  if (direccionesCount > 0) {
    throw {
      status: 409,
      message:
        "No se puede eliminar la provincia porque tiene direcciones asociadas",
    };
  }

  // 3. Eliminar
  await prisma.provincia.delete({
    where: { id_provincia: id },
  });

  return provincia;
};

module.exports = {
  getAllProvincias,
  getProvinciaById,
  createProvincia,
  updateProvincia,
  deleteProvincia,
};
