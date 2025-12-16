const prisma = require("../config/prisma");

const getAllProvincias = async () => {
  return prisma.provincia.findMany();
};

const getProvinciaById = async (id) => {
  return prisma.provincia.findUnique({
    where: { id_provincia: id },
  });
};

const createProvincia = async (data) => {
  return prisma.provincia.create({
    data,
  });
};

const updateProvincia = async (id, data) => {
  const provincia = await prisma.provincia.findUnique({
    where: { id_provincia: id },
  });
  if (!provincia) {
    return null;
  }

  return prisma.provincia.update({
    where: { id_provincia: id },
    data: data,
  });
};

const deleteProvincia = async (id) => {
  const provincia = await prisma.provincia.findUnique({
    where: { id_provincia: id },
  });

  if (!provincia) {
    return null;
  }

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
