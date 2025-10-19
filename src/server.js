import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import initModels from "./models/init-models.js";


// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
app.use(cors());
app.use(express.json());

// Inicializar modelos y relaciones
const models = initModels(sequelize);

// Probar conexión a base de datos
try {
  await sequelize.authenticate();
  console.log("✅ Conexión establecida con MySQL.");
} catch (error) {
  console.error("❌ Error al conectar con MySQL:", error);
}

// === IMPORTAR RUTAS ===
import usuarioRoutes from "./routes/usuario.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import ventaRoutes from "./routes/venta.routes.js";
import authRoutes from "./routes/auth.routes.js";

// === USO DE RUTAS ===
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/auth", authRoutes);

// Ruta raíz
app.get("/", (req, res) => res.send("🚀 API Effata Repuestos activa."));

// Puerto de ejecución
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
);
