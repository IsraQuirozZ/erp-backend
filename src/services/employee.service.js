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

const createEmployee = async () => {
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

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
};
