const prisma = require("../config/prisma");

const getAllPayrolls = async () => {
  return await prisma.payroll.findMany({
    orderBy: { period: "asc" },
    include: { employee: true },
  });
};

const getPayrollById = async (id) => {
  const payroll = await prisma.payroll.findUnique({
    where: { id_payroll: id },
    include: { employee: true },
  });

  if (!payroll) {
    throw {
      status: 404,
      message: "Payroll not found",
    };
  }

  return payroll;
};

const createPayroll = async (data) => {
  const employee = await prisma.employee.findUnique({
    where: { id_employee: data.id_employee },
  });

  if (!employee) {
    throw {
      status: 400,
      message: "The employee provided does not exist",
    };
  }

  return prisma.payroll.create({
    include: { employee: true },
    data,
  });
};

const updatePayrollById = async (id, data) => {
  const payroll = await prisma.payroll.findUnique({
    where: { id_payroll: id },
  });

  if (!payroll) {
    throw {
      status: 404,
      message: "Payroll not found",
    };
  }

  // The employee can't be updated -- Also validated in the payroll.validator.js
  if (data.id_employee !== undefined) {
    throw {
      status: 400,
      message: "The employee can not be updated",
    };
  }

  // New Values + Old Values
  const baseSalary =
    data.base_salary !== undefined ? data.base_salary : payroll.base_salary;

  const deductions =
    data.deductions !== undefined ? data.deductions : payroll.deductions;

  const taxes = data.taxes !== undefined ? data.taxes : payroll.taxes;

  // Calculate net_salary
  data.net_salary = baseSalary - deductions - taxes;

  return await prisma.payroll.update({
    where: { id_payroll: id },
    include: { employee: true },
    data: data,
  });
};

const deletePayrollById = async (id) => {
  const payroll = await prisma.payroll.findUnique({
    where: { id_payroll: id },
  });

  if (!payroll) {
    throw {
      status: 404,
      message: "Payroll not found",
    };
  }

  await prisma.payroll.delete({
    where: { id_payroll: id },
    include: { employee: true },
  });

  return payroll;
};

module.exports = {
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  updatePayrollById,
  deletePayrollById,
};
