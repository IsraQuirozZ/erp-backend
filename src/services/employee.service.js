const prisma = require("../config/prisma");

const getAllEmployees = async () => {
  return await prisma.employee.findMany({
    orderBy: { firstName: "asc" },
    include: { address: true, department: true },
  });
};

const getEmployeeById = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id_employee: id },
    include: { address: true, department: true },
  });

  if (!employee) {
    throw {
      status: 404,
      message: "Employee not found",
    };
  }

  return employee;
};

const createEmployeeById = async (data) => {
  try {
    return await prisma.employee.create({
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "A employee with this email already exists",
      };
    }
    throw error;
  }
};

const updateEmployeeById = async (id, data) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id_employee: id },
    });

    if (!employee) {
      throw {
        status: 404,
        message: "Employee not found",
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

    if (data.id_department !== undefined) {
      const department = await prisma.department.findUnique({
        where: { id_department: data.id_department },
      });

      if (!department) {
        throw {
          status: 400,
          message: "The department provided does not exist",
        };
      }
    }

    return await prisma.employee.update({
      where: { id_employee: id },
      include: { address: true, department: true },
      data: data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "A employee with this email already exists",
      };
    }
    throw error;
  }
};

const deleteEmployeeById = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id_employee: id },
  });

  if (!employee) {
    throw {
      status: 404,
      message: "Employee not found",
    };
  }

  await prisma.employee.delete({
    where: { id_employee: id },
    include: { address: true, department: true },
  });

  return employee;
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
