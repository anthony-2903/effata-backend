import { DataTypes } from "sequelize";
import categoriasModel from "./categorias.js";
import detalleVentasModel from "./detalle_ventas.js";
import marcasModel from "./marcas.js";
import modelosModel from "./modelos.js";
import productosModel from "./productos.js";
import proveedoresModel from "./proveedores.js";
import rolesModel from "./roles.js";
import stockModel from "./stock.js";
import ubicacionesModel from "./ubicaciones.js";
import usuariosModel from "./usuarios.js";
import ventasModel from "./ventas.js";

export default function initModels(sequelize) {
  const categorias = categoriasModel(sequelize, DataTypes);
  const detalle_ventas = detalleVentasModel(sequelize, DataTypes);
  const marcas = marcasModel(sequelize, DataTypes);
  const modelos = modelosModel(sequelize, DataTypes);
  const productos = productosModel(sequelize, DataTypes);
  const proveedores = proveedoresModel(sequelize, DataTypes);
  const roles = rolesModel(sequelize, DataTypes);
  const stock = stockModel(sequelize, DataTypes);
  const ubicaciones = ubicacionesModel(sequelize, DataTypes);
  const usuarios = usuariosModel(sequelize, DataTypes);
  const ventas = ventasModel(sequelize, DataTypes);

  productos.belongsTo(categorias, { as: "id_categoria_categoria", foreignKey: "id_categoria" });
  categorias.hasMany(productos, { as: "productos", foreignKey: "id_categoria" });
  modelos.belongsTo(marcas, { as: "id_marca_marca", foreignKey: "id_marca" });
  marcas.hasMany(modelos, { as: "modelos", foreignKey: "id_marca" });
  productos.belongsTo(modelos, { as: "id_modelo_modelo", foreignKey: "id_modelo" });
  modelos.hasMany(productos, { as: "productos", foreignKey: "id_modelo" });
  detalle_ventas.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto" });
  productos.hasMany(detalle_ventas, { as: "detalle_venta", foreignKey: "id_producto" });
  stock.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto" });
  productos.hasMany(stock, { as: "stocks", foreignKey: "id_producto" });
  productos.belongsTo(proveedores, { as: "id_proveedor_proveedore", foreignKey: "id_proveedor" });
  proveedores.hasMany(productos, { as: "productos", foreignKey: "id_proveedor" });
  usuarios.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol" });
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "id_rol" });
  productos.belongsTo(ubicaciones, { as: "id_ubicacion_ubicacione", foreignKey: "id_ubicacion" });
  ubicaciones.hasMany(productos, { as: "productos", foreignKey: "id_ubicacion" });
  ventas.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
  usuarios.hasMany(ventas, { as: "venta", foreignKey: "id_usuario" });
  detalle_ventas.belongsTo(ventas, { as: "id_venta_venta", foreignKey: "id_venta" });
  ventas.hasMany(detalle_ventas, { as: "detalle_venta", foreignKey: "id_venta" });

  return {
    categorias,
    detalle_ventas,
    marcas,
    modelos,
    productos,
    proveedores,
    roles,
    stock,
    ubicaciones,
    usuarios,
    ventas,
  };
}
