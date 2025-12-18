const prisma = require("../config/prisma");

const getAllDirecciones = async () => {
  return prisma.direccion.findMany();
};

const getDireccionById = async (id) => {
  return prisma.direccion.findUnique({
    where: { id_direccion: id },
  });
};

const createDireccion = async (data) => {
  return prisma.direccion.create({
    data,
  });
};

const updateDireccion = async (id, data) => {
  const direccion = await prisma.direccion.findUnique({
    where: { id_direccion: id },
  });

  if (!direccion) {
    return null;
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
    return null;
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
