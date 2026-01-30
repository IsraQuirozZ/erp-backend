const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const onlyNumbersRegex = /^[0-9]+$/;
const onlyLettersAndNumbersRegex = /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{9,12}$/;
const salaryRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const decimalRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{9,12}$/;

module.exports = {
  onlyLettersRegex,
  onlyNumbersRegex,
  onlyLettersAndNumbersRegex,
  emailRegex,
  phoneRegex,
  salaryRegex,
  decimalRegex,
  periodRegex,
  passwordRegex,
};
