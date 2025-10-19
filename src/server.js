import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 API Effatá Backend funcionando correctamente");
});

(async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("🧩 Modelos sincronizados correctamente con la BD");
  } catch (error) {
    console.error("Error al sincronizar modelos:", error);
  }
})();

app.listen(process.env.PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${process.env.PORT}`);
});
