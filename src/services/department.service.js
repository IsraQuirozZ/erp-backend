const prisma = require("../config/prisma");

const getAllDepartments = async () => {
  return prisma.department.findMany({
    orderBy: { name: "asc" },
  });
};

const getDepartmentById = async (id) => {
  const department = await prisma.department.findUnique({
    where: { id_department: id },
  });

  if (!department) {
    throw {
      status: 404,
      message: "Department not found",
    };
  }

  return department;
};

const createDepartment = async (data) => {
  try {
    return await prisma.department.create({
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "A department with this name already exists",
      };
    }
    throw error;
  }
};

const updateDepartmentById = async (id, data) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id_department: id },
    });

    if (!department) {
      throw {
        status: 404,
        message: "Department not found",
      };
    }

    return await prisma.department.update({
      where: { id_department: id },
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "A department with this name already exists",
      };
    }
    throw error;
  }
};

const deleteDepartmentById = async (id) => {
  const department = await prisma.department.findUnique({
    where: { id_department: id },
  });

  if (!department) {
    throw {
      status: 404,
      message: "Department not found",
    };
  }

  // IF ASSOCIATED EMPLOYEES -> DON'T DELETE
  const employeesCount = await prisma.employee.count({
    where: { id_department: id },
  });

  if (employeesCount > 0) {
    throw {
      status: 409,
      message: "Cannot delete department because it has associated employees.",
    };
  }

  await prisma.department.delete({
    where: { id_department: id },
  });

  return department;
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartmentById,
  deleteDepartmentById,
};
