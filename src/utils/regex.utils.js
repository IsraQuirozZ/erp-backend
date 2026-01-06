const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const onlyNumbersRegex = /^[0-9]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{9}$/;
const salaryRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const decimalRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

module.exports = {
  onlyLettersRegex,
  onlyNumbersRegex,
  emailRegex,
  phoneRegex,
  salaryRegex,
  decimalRegex,
  periodRegex,
};
