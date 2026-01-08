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

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
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
    res.json({
      message: `Employee --${employee.firstName} ${employee.lastName}-- with ID ${employee.id_employee} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
};
