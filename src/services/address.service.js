const prisma = require("../config/prisma");

const getAllAddresses = async () => {
  return prisma.address.findMany({
    orderBy: {
      street: "asc",
    },
    include: {
      province: true,
    },
  });
};

const getAddressById = async (id) => {
  const address = await prisma.address.findUnique({
    where: { id_address: id },
    include: {
      province: true,
    },
  });

  if (!address) {
    throw {
      status: 404,
      message: `Adress with id: ${id} not found`,
    };
  }

  return address;
};

const createAddress = async (data, tx = prisma) => {
  // We don't need this any more, not think just execute... in the createX.service, we made validations

  // const province = await prisma.province.findUnique({
  //   where: { id_province: data.id_province },
  // });

  // if (!province) {
  //   throw {
  //     status: 400,
  //     message: "Province not found",
  //   };
  // }

  return await tx.address.create({
    data,
    include: {
      province: true,
    },
  });
};

const updateAddress = async (id, data) => {
  const address = await prisma.address.findUnique({
    where: { id_address: id },
    include: {
      province: true,
    },
  });

  if (!address) {
    throw {
      status: 404,
      message: "Address not found",
    };
  }

  // Update the province
  if (data.id_province) {
    const province = await prisma.province.findUnique({
      where: { id_province: data.id_province },
    });

    if (!province) {
      throw {
        status: 400,
        message: "Province not exists",
      };
    }
  }

  return prisma.address.update({
    where: { id_address: id },
    include: {
      province: true,
    },
    data: data,
  });
};

const deleteAddress = async (id) => {
  const address = await prisma.address.findUnique({
    where: { id_address: id },
  });

  if (!address) {
    throw {
      status: 404,
      message: `Address with ID ${id} not found`,
    };
  }

  // If CLIENT/SUPPLIER/EMPLOYEE associated -> Don't delete
  const clientCount = await prisma.client.count({
    where: { id_address: id },
  });

  const suppliersCount = await prisma.supplier.count({
    where: { id_address: id },
  });

  const employeesCount = await prisma.employee.count({
    where: { id_address: id },
  });

  const warehousesCount = await prisma.warehouse.count({
    where: { id_address: id },
  });

  if (
    clientCount > 0 ||
    suppliersCount > 0 ||
    employeesCount > 0 ||
    warehousesCount > 0
  ) {
    throw {
      status: 409,
      message: "Address cannot be deleted because it has associated records",
    };
  }

  await prisma.address.delete({
    where: { id_address: id },
  });

  return address;
};

module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
