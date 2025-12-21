const express = require("express");
const provinceRoutes = require("./routes/province.routes");
const AddressRoutes = require("./routes/address.routes");
const clientRoutes = require("./routes/client.routes");
const suppliersRoutes = require("./routes/supplier.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/api/provinces", provinceRoutes);
app.use("/api/addresses", AddressRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/suppliers", suppliersRoutes);

// Middleware global de errores (SIEMPRE EL ÚLTIMO)
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("API ERP funcionando");
});

module.exports = app;
