import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";

const { usuarios, roles } = initModels(sequelize);

export const register = async (req, res) => {
  try {
    const { nombre, username, password, id_rol, email, telefono } = req.body;

    const userExist = await usuarios.findOne({ where: { username } });
    if (userExist)
      return res.status(400).json({ message: "El usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);
    const nuevoUsuario = await usuarios.create({
      nombre,
      username,
      password: hashed,
      id_rol,
      email,
      telefono,
      estado: "activo",
    });

    res.status(201).json({ message: "Usuario registrado con éxito", nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en registro", error });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usuarios.findOne({
      where: { username },
      include: { model: roles, as: "id_rol_role" },
    });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      {
        id: user.id_usuario,
        username: user.username,
        rol: user.id_rol_role.nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol: user.id_rol_role.nombre,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en login", error });
  }
};
