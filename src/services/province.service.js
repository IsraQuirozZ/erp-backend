const prisma = require("../config/prisma");

const getAllProvinces = async () => {
  return prisma.province.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const getProvinceById = async (id) => {
  const province = await prisma.province.findUnique({
    where: { id_province: id },
  });

  if (!province) {
    throw {
      status: 404,
      message: "Province not found",
    };
  }

  return province;
};

const createProvince = async (data) => {
  try {
    return await prisma.province.create({
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "A province with this name already exists",
      };
    }

    throw error;
  }
};

const updateProvince = async (id, data) => {
  const province = await prisma.province.findUnique({
    where: { id_province: id },
  });

  if (!province) {
    throw {
      status: 404,
      message: "Province not found",
    };
  }

  return prisma.province.update({
    where: { id_province: id },
    data,
  });
};

const deleteProvince = async (id) => {
  // 1. Check if province exists
  const province = await prisma.province.findUnique({
    where: { id_province: id },
  });

  if (!province) {
    throw {
      status: 404,
      message: `Province with id ${id} not found`,
    };
  }

  // 2. Comprobar direcciones asociadas
  const addressCount = await prisma.address.count({
    where: { id_province: id },
  });

  if (addressCount > 0) {
    throw {
      status: 409,
      message: "Cannot delete province because it has associated addresses",
    };
  }

  // 3. Delete province
  await prisma.province.delete({
    where: { id_province: id },
  });

  return province;
};

module.exports = {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
};
