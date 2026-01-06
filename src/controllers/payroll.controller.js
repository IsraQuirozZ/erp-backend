const payrollService = require("../services/payroll.service");

const getAllPayrolls = async (req, res, next) => {
  try {
    const payrolls = await payrollService.getAllPayrolls();
    res.json(payrolls);
  } catch (error) {
    next(error);
  }
};

const getPayrollById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payroll = await payrollService.getPayrollById(id);
    res.json(payroll);
  } catch (error) {
    next(error);
  }
};

const createPayroll = async (req, res, next) => {
  try {
    const payroll = await payrollService.createPayroll(req.body);
    res.status(201).json(payroll);
  } catch (error) {
    next(error);
  }
};

const updatePayrollById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payroll = await payrollService.updatePayrollById(id, req.body);
    res.json(payroll);
  } catch (error) {
    next(error);
  }
};

const deletePayrollById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payroll = await payrollService.deletePayrollById(id);
    res.json(payroll);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  updatePayrollById,
  deletePayrollById,
};
