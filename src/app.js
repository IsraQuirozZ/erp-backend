const express = require("express");
const provinciaRoutes = require("./routes/provincia.routes");
const direccionRoutes = require("./routes/direccion.routes");
const clienteRoutes = require("./routes/cliente.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/api/provincias", provinciaRoutes);
app.use("/api/direcciones", direccionRoutes);
app.use("/api/clientes", clienteRoutes);

// Middleware global de errores (SIEMPRE EL ÚLTIMO)
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("API ERP funcionando");
});

module.exports = app;
