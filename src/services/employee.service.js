const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");
const provinceService = require("../services/province.service");
const addressService = require("../services/address.service");
const departmentService = require("../services/department.service");

const getAllEmployees = async () => {
  return await prisma.employee.findMany({
    where: { active: true },
    // orderBy: { firstName: "asc" },
    orderBy: { id_employee: "asc" },
    include: { address: { include: { province: true } }, department: true },
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

const createEmployee = async (data) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id_address: data.id_address },
    });

    if (!address) {
      throw {
        status: 400,
        message: "The address provided does not exist",
      };
    }

    const department = await prisma.department.findUnique({
      where: { id_department: data.id_department },
    });

    if (!department) {
      throw {
        status: 400,
        message: "The department provided does not exist",
      };
    }

    return await prisma.employee.create({
      data,
      include: { address: true, department: true },
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

// USE CASE
const createFullEmployee = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { employee, address, province, department } = data;

      // PROVINCE --> provinceService
      let existingProvince = await provinceService.getProvinceByName(
        province.name,
        tx,
      );

      if (!existingProvince) {
        existingProvince = await provinceService.createProvince(province, tx);
      }

      // ADDRESS --> addresService
      const newAddress = await addressService.createAddress(
        { ...address, id_province: existingProvince.id_province },
        tx,
      );

      // DEPARTMENT --> departmentService
      let existingDepartment = await departmentService.getDepartmentByName(
        department.name,
        tx,
      );

      if (!existingDepartment) {
        existingDepartment = await departmentService.createDepartment(
          department,
          tx,
        );
      }

      // EMPLOYEE
      const newEmployee = await tx.employee.create({
        data: {
          ...employee,
          id_address: newAddress.id_address,
          id_department: existingDepartment.id_department,
        },
        include: { address: true, department: true },
      });

      return newEmployee;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw {
        status: 400,
        message: "Employee with this email already exists",
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

// USE CASE
const updateFullEmployee = async (id_employee, data) => {
  const { employee, address, province, department } = data;

  try {
    return await prisma.$transaction(async (tx) => {
      const existingEmployee = await tx.employee.findUnique({
        where: { id_employee },
        include: { address: true, department: true },
      });

      if (!existingEmployee) {
        throw {
          status: 404,
          message: "Employee not found",
        };
      }

      let existingProvince = await tx.province.findFirst({
        where: { name: province.name },
      });

      if (!existingProvince) {
        existingProvince = await tx.province.create({
          data: { name: province.name },
        });
      }

      const updatedAddress = await tx.address.update({
        where: { id_address: existingEmployee.id_address },
        data: {
          ...address,
          id_province: existingProvince.id_province,
        },
      });

      // DEPARTMENT --> departmentService
      let existingDepartment = await departmentService.getDepartmentByName(
        department.name,
        tx,
      );

      if (!existingDepartment) {
        existingDepartment = await departmentService.createDepartment(
          department,
          tx,
        );
      }

      const updatedEmployee = await tx.employee.update({
        where: { id_employee },
        data: {
          ...employee,
        },
        include: {
          address: {
            include: {
              province: true,
            },
          },
          department: true,
        },
      });

      return updatedEmployee;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw {
        status: 400,
        message: "Employee with this email already exists",
      };
    }

    throw error;
  }
};

// SOFT DELETE
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

  // If payroll associated -> Don't delete
  const payrollsCount = await prisma.payroll.count({
    where: { id_employee: id },
  });

  if (payrollsCount > 0) {
    throw {
      status: 409,
      message: "Employee can not be deleted because it has associated payrolls",
    };
  }

  return await prisma.employee.update({
    where: { id_employee: id },
    include: { address: true, department: true },
    data: { active: false },
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  createFullEmployee,
  updateEmployeeById,
  updateFullEmployee,
  deleteEmployeeById,
};
