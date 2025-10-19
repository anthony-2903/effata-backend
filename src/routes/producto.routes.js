import express from "express";
import {
  listProductos, getProducto, createProducto, updateProducto, deleteProducto
} from "../controllers/producto.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// listar y obtener: cualquier usuario autenticado
router.get("/", verifyToken, listProductos);
router.get("/:id", verifyToken, getProducto);

// crear/actualizar: admin o almacén
router.post("/", verifyToken, authorizeRoles("Administrador","Almacén","Almacen","almacen"), createProducto);
router.put("/:id", verifyToken, authorizeRoles("Administrador","Almacén","Almacen","almacen"), updateProducto);

// eliminar: solo admin
router.delete("/:id", verifyToken, authorizeRoles("Administrador"), deleteProducto);

export default router;
