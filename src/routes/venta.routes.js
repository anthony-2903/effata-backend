import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { crearVenta, listarVentas, obtenerVenta } from "../controllers/venta.controller.js"; // 👈 corregido

const router = express.Router();

router.get("/", verifyToken, listarVentas);
router.get("/:id", verifyToken, obtenerVenta);

router.post(
  "/",
  verifyToken,
  authorizeRoles("Administrador", "Vendedor"),
  crearVenta // 👈 corregido
);

export default router;
