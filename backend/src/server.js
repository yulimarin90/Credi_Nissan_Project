const express = require("express");
const cors = require("cors");
require("dotenv").config();

const importadorRoutes = require("./modules/importador/routes/routes");
const authRoutes = require("./modules/auth/routes/routes");
const pdfRoutes = require("./modules/pdf/routes/routes");
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/importador", importadorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
// Prueba del servidor
app.get("/", (_req, res) => {
    res.json({
        mensaje: "API Credi Nissan funcionando correctamente"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});