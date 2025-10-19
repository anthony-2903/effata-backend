import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";

const m = initModels(sequelize);
const {
  ventas, detalle_ventas, usuarios, productos, stock
} = m;

/** Utilidad: genera número de comprobante simple (ej. BOL-20251019-00017) */
function generarNumeroComprobante(ultimoCorrelativo = 0) {
  const hoy = new Date();
  const y = hoy.getFullYear();
  const m = String(hoy.getMonth() + 1).padStart(2, "0");
  const d = String(hoy.getDate()).padStart(2, "0");
  const correl = String(ultimoCorrelativo + 1).padStart(5, "0");
  return `BOL-${y}${m}${d}-${correl}`;
}

/**
 * POST /api/ventas
 * Body:
 * {
 *   "tipo_comprobante": "boleta",
 *   "observaciones": "opcional",
 *   "items": [
 *     { "id_producto": 1, "cantidad": 2, "precio_unitario": 25.90 }, // precio_unitario opcional
 *     { "id_producto": 5, "cantidad": 1 }
 *   ]
 * }
 * El usuario se toma del token (req.user.id)
 */
export const crearVenta = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id_usuario = req.user?.id; // del middleware verifyToken
    const { tipo_comprobante = "boleta", observaciones = "", items = [] } = req.body;

    if (!id_usuario) return res.status(401).json({ message: "Usuario no autenticado" });
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "La venta requiere al menos un item" });
    }

    // correlativo del día (simple). Puedes cambiarlo por una tabla de series si lo prefieres.
    const hoy0 = new Date(); hoy0.setHours(0,0,0,0);
    const hoy1 = new Date(); hoy1.setHours(23,59,59,999);
    const ventasHoy = await ventas.count({
      where: { fecha: { [Op.between]: [hoy0, hoy1] } },
      transaction: t
    });
    const numero_comprobante = generarNumeroComprobante(ventasHoy);

    // Crear cabecera con total = 0 (luego actualizamos)
    const cab = await ventas.create({
      fecha: new Date(),
      id_usuario,
      total: 0,
      tipo_comprobante,
      numero_comprobante,
      observaciones
    }, { transaction: t });

    let total = 0;

    // Procesar items: validar stock, fijar precio si no viene, crear detalle, descontar stock
    for (const it of items) {
      const prod = await productos.findByPk(it.id_producto, { transaction: t });
      if (!prod) {
        throw new Error(`Producto ${it.id_producto} no existe`);
      }

      // Leer stock con lock de actualización
      const stk = await stock.findOne({
        where: { id_producto: it.id_producto },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      if (!stk) throw new Error(`Stock del producto ${it.id_producto} no existe`);
      if (stk.cantidad < it.cantidad) {
        throw new Error(`Stock insuficiente para producto ${it.id_producto} (disp: ${stk.cantidad}, req: ${it.cantidad})`);
      }

      const precio_unitario = (typeof it.precio_unitario === "number")
        ? it.precio_unitario
        : Number(prod.precio_estandar || 0);

      const subtotal = Number(precio_unitario) * Number(it.cantidad);

      // Crear detalle
      await detalle_ventas.create({
        id_venta: cab.id_venta,
        id_producto: it.id_producto,
        cantidad: it.cantidad,
        precio_unitario,
        subtotal
      }, { transaction: t });

      // Descontar stock
      await stk.update({ cantidad: stk.cantidad - it.cantidad }, { transaction: t });

      total += subtotal;
    }

    // Actualizar total de cabecera
    await cab.update({ total }, { transaction: t });

    await t.commit();
    const ventaCreada = await ventas.findByPk(cab.id_venta, {
      include: [
        { model: usuarios, as: "id_usuario_usuario", attributes: ["id_usuario","nombre","username"] },
        { model: detalle_ventas, as: "detalle_venta" }
      ]
    });

    return res.status(201).json({
      message: "Venta registrada",
      venta: ventaCreada
    });

  } catch (error) {
    await t.rollback();
    console.error("crearVenta error:", error);
    return res.status(400).json({ message: error.message || "Error al registrar venta" });
  }
};

/**
 * GET /api/ventas
 * Filtros: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&usuario=2&page=1&size=10
 */
export const listarVentas = async (req, res) => {
  try {
    const { desde, hasta, usuario, page = 1, size = 10 } = req.query;
    const where = {};
    if (desde && hasta) {
      where.fecha = { [Op.between]: [new Date(`${desde} 00:00:00`), new Date(`${hasta} 23:59:59`)] };
    }
    if (usuario) where.id_usuario = usuario;

    const pageNum = Math.max(parseInt(page), 1);
    const pageSize = Math.max(parseInt(size), 1);

    const data = await ventas.findAndCountAll({
      where,
      include: [{ model: usuarios, as: "id_usuario_usuario", attributes: ["id_usuario","nombre","username"] }],
      order: [["fecha","DESC"]],
      limit: pageSize,
      offset: (pageNum - 1) * pageSize
    });

    res.json({
      total: data.count,
      page: pageNum,
      size: pageSize,
      items: data.rows
    });
  } catch (error) {
    console.error("listarVentas error:", error);
    res.status(500).json({ message: "Error al listar ventas" });
  }
};

/**
 * GET /api/ventas/:id
 */
export const obtenerVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const v = await ventas.findByPk(id, {
      include: [
        { model: usuarios, as: "id_usuario_usuario", attributes: ["id_usuario","nombre","username"] },
        { model: detalle_ventas, as: "detalle_venta",
          include: [{ model: productos, as: "id_producto_producto", attributes: ["id_producto","nombre","codigo_almacen","codigo_proveedor"] }]
        }
      ]
    });
    if (!v) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(v);
  } catch (error) {
    console.error("obtenerVenta error:", error);
    res.status(500).json({ message: "Error al obtener venta" });
  }
};
