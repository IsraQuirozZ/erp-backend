const employeeService = require("../services/employee.service");

const getEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const employee = await employeeService.getEmployeeById(id);
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const createEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployeeById(req.body);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

const updateEmployeeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const employee = await employeeService.updateEmployeeById(id, req.body);
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const deleteEmployeeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const employee = await employeeService.deleteEmployeeById(id);
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
