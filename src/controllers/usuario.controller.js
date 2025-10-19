import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";

const models = initModels(sequelize);
const { usuarios, roles } = models;

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const data = await usuarios.findAll({
      include: [{ model: roles, as: "id_rol_role", attributes: ["nombre"] }],
      attributes: ["id_usuario", "nombre", "username", "email", "estado"],
    });

    res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      total: data.length,
      usuarios: data,
    });
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
