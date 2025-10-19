import express from "express";
import { getVentas, getVentaById, createVenta, deleteVenta } from "../controllers/venta.controller.js";

const router = express.Router();

router.get("/", getVentas);
router.get("/:id", getVentaById);
router.post("/", createVenta);
router.delete("/:id", deleteVenta);

export default router;
