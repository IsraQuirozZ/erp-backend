const capitalize = (text) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CapitalizeFirstLetter = (text) => {
  if (text.length === 0) {
    return "";
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

module.exports = {
  capitalize,
  CapitalizeFirstLetter,
};
