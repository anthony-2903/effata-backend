import express from "express";
import { getUsuarios } from "../controllers/usuario.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ruta protegida
router.get("/", verifyToken, getUsuarios);

export default router;
