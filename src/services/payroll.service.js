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
  return await prisma.payroll.create({
    data,
  });
};

module.exports = {
  getAllPayrolls,
  getPayrollById,
  createPayroll,
};
