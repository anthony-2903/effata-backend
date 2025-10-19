import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";

const m = initModels(sequelize);
const {
  productos, categorias, marcas, modelos, proveedores, ubicaciones, stock
} = m;

/**
 * GET /api/productos
 * Soporta filtros: ?q=texto&categoria=1&marca=1&modelo=1&page=1&size=10&sort=nombre:asc
 */
export const listProductos = async (req, res) => {
  try {
    const {
      q, categoria, marca, modelo, page = 1, size = 10, sort = "nombre:asc"
    } = req.query;

    const [sortField, sortDir] = sort.split(":");
    const where = {};

    if (q) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${q}%` } },
        { codigo_proveedor: { [Op.like]: `%${q}%` } },
        { codigo_almacen: { [Op.like]: `%${q}%` } },
      ];
    }
    if (categoria) where.id_categoria = categoria;
    if (modelo) where.id_modelo = modelo;
    if (marca) {
      // filtrar por marca a través del include de modelos
    }

    const pageNum = Math.max(parseInt(page), 1);
    const pageSize = Math.max(parseInt(size), 1);

    const data = await productos.findAndCountAll({
      where,
      include: [
        { model: categorias, as: "id_categoria_categoria", attributes: ["id_categoria","nombre"] },
        { model: modelos, as: "id_modelo_modelo", attributes: ["id_modelo","nombre","id_marca"],
          include: [{ model: marcas, as: "id_marca_marca", attributes: ["id_marca","nombre"] }]
        },
        { model: proveedores, as: "id_proveedor_proveedore", attributes: ["id_proveedor","nombre"] },
        { model: ubicaciones, as: "id_ubicacion_ubicacione", attributes: ["id_ubicacion","torre","piso","seccion"] },
        { model: stock, as: "stocks", attributes: ["id_stock","cantidad"] },
      ],
      order: [[sortField || "nombre", (sortDir || "asc").toUpperCase()]],
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
    });

    res.json({
      total: data.count,
      page: pageNum,
      size: pageSize,
      items: data.rows,
    });
  } catch (err) {
    console.error("listProductos error:", err);
    res.status(500).json({ message: "Error al listar productos" });
  }
};

/**
 * GET /api/productos/:id
 */
export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await productos.findByPk(id, {
      include: [
        { model: categorias, as: "id_categoria_categoria", attributes: ["id_categoria","nombre"] },
        { model: modelos, as: "id_modelo_modelo", attributes: ["id_modelo","nombre","id_marca"],
          include: [{ model: marcas, as: "id_marca_marca", attributes: ["id_marca","nombre"] }]
        },
        { model: proveedores, as: "id_proveedor_proveedore", attributes: ["id_proveedor","nombre"] },
        { model: ubicaciones, as: "id_ubicacion_ubicacione", attributes: ["id_ubicacion","torre","piso","seccion"] },
        { model: stock, as: "stocks", attributes: ["id_stock","cantidad"] },
      ],
    });
    if (!p) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(p);
  } catch (err) {
    console.error("getProducto error:", err);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

/**
 * POST /api/productos  (roles: admin, almacen)
 * Body: { codigo_proveedor, codigo_almacen, nombre, descripcion, precio_minimo, precio_estandar,
 *         id_categoria, id_proveedor, id_modelo, id_ubicacion, stock_inicial }
 */export const createProducto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      codigo_proveedor, codigo_almacen, nombre, descripcion,
      precio_minimo, precio_estandar, id_categoria, id_proveedor,
      id_modelo, id_ubicacion, stock_inicial = 0
    } = req.body;

    // 1) Validar FKs antes de crear
    const [cat, prov, mod, ubi] = await Promise.all([
      categorias.findByPk(id_categoria),
      proveedores.findByPk(id_proveedor),
      modelos.findByPk(id_modelo),
      ubicaciones.findByPk(id_ubicacion),
    ]);

    if (!cat)  return res.status(400).json({ message: `La categoría ${id_categoria} no existe` });
    if (!prov) return res.status(400).json({ message: `El proveedor ${id_proveedor} no existe` });
    if (!mod)  return res.status(400).json({ message: `El modelo ${id_modelo} no existe` });
    if (!ubi)  return res.status(400).json({ message: `La ubicación ${id_ubicacion} no existe` });

    // 2) Crear producto
    const nuevo = await productos.create({
      codigo_proveedor, codigo_almacen, nombre, descripcion,
      precio_minimo, precio_estandar, id_categoria, id_proveedor,
      id_modelo, id_ubicacion
    }, { transaction: t });

    // 3) Crear stock inicial
    await stock.create({
      id_producto: nuevo.id_producto,
      cantidad: stock_inicial
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Producto creado", producto: nuevo });

  } catch (err) {
    await t.rollback();
    console.error("createProducto error:", err);
    // Si vino del motor MySQL, usa el mensaje para ayudar
    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "Algún ID enviado no existe (categoría, proveedor, modelo o ubicación)" });
    }
    res.status(500).json({ message: "Error al crear producto" });
  }
};

/**
 * PUT /api/productos/:id  (roles: admin, almacen)
 */
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await productos.findByPk(id);
    if (!p) return res.status(404).json({ message: "Producto no encontrado" });

    await p.update(req.body);
    res.json({ message: "Producto actualizado", producto: p });
  } catch (err) {
    console.error("updateProducto error:", err);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

/**
 * DELETE /api/productos/:id  (roles: admin)
 * (Borrado físico; si prefieres soft delete, agrega un campo 'estado')
 */
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await productos.findByPk(id);
    if (!p) return res.status(404).json({ message: "Producto no encontrado" });

    await p.destroy();
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("deleteProducto error:", err);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
