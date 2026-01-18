const express = require("express");
const provinceRoutes = require("./routes/province.routes");
const AddressRoutes = require("./routes/address.routes");
const clientRoutes = require("./routes/client.routes");
const supplierRoutes = require("./routes/supplier.routes");
const departmentRoutes = require("./routes/department.routes");
const employeeRoutes = require("./routes/employee.routes");
const payrollRoutes = require("./routes/payroll.routes");
const supplierProductRoutes = require("./routes/supplier-product.routes");
const supplierOrderRoutes = require("./routes/supplier-order.routes");
const supplierOrderItemRoutes = require("./routes/supplier-order-item.routes");
const productRoutes = require("./routes/product.routes");
const warehouseRoutes = require("./routes/warehouse.routes");
const supplierProductInventoryRoutes = require("./routes/supplier-product-inventory.routes");
const productInventoryRoutes = require("./routes/product-inventory.routes");
const shipmentRoutes = require("./routes/shipment.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/api/provinces", provinceRoutes);
app.use("/api/addresses", AddressRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/supplier-products", supplierProductRoutes);
app.use("/api/supplier-orders", supplierOrderRoutes);
app.use("/api/supplier-order-items", supplierOrderItemRoutes);
app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/supplier-product-inventories", supplierProductInventoryRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/product-inventories", productInventoryRoutes);

// Middleware global de errores (SIEMPRE EL ÚLTIMO)
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("API ERP funcionando");
});

module.exports = app;
