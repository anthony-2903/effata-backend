import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Probar conexión
try {
  await sequelize.authenticate();
  console.log("✅ Conexión establecida con la base de datos MySQL");
} catch (error) {
  console.error("❌ Error al conectar con la base de datos:", error);
}
