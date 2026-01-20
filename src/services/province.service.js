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

const findProvinceById = async (name) => {
  const province = await prisma.province.findFirst({
    where: { name },
  });

  if (!province) {
    throw {
      status: 404,
      message: "Province not found",
    };
  }

  return province;
};

// No throw error (use in creation of clients, suppliers, employees and warehouses)
const getProvinceByName = async (name, tx = prisma) => {
  return await tx.province.findFirst({
    where: { name },
  });
};

const createProvince = async (data, tx = prisma) => {
  try {
    return tx.province.create({
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
  try {
    const province = await prisma.province.findUnique({
      where: { id_province: id },
    });

    if (!province) {
      throw {
        status: 404,
        message: "Province not found",
      };
    }

    return await prisma.province.update({
      where: { id_province: id },
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

  // 2. Check associated addresses
  const addressCount = await prisma.address.count({
    where: { id_province: id },
  });

  if (addressCount > 0) {
    throw {
      status: 409,
      message: "Province cannot be deleted because it has associated addresses",
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
  findProvinceById, // TODO: Add to routes
  getProvinceByName, // USE CASE
  createProvince,
  updateProvince,
  deleteProvince,
};
