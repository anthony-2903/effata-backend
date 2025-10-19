var DataTypes = require("sequelize").DataTypes;
var _categorias = require("./categorias");
var _detalle_ventas = require("./detalle_ventas");
var _marcas = require("./marcas");
var _modelos = require("./modelos");
var _productos = require("./productos");
var _proveedores = require("./proveedores");
var _roles = require("./roles");
var _stock = require("./stock");
var _ubicaciones = require("./ubicaciones");
var _usuarios = require("./usuarios");
var _ventas = require("./ventas");

function initModels(sequelize) {
  var categorias = _categorias(sequelize, DataTypes);
  var detalle_ventas = _detalle_ventas(sequelize, DataTypes);
  var marcas = _marcas(sequelize, DataTypes);
  var modelos = _modelos(sequelize, DataTypes);
  var productos = _productos(sequelize, DataTypes);
  var proveedores = _proveedores(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var stock = _stock(sequelize, DataTypes);
  var ubicaciones = _ubicaciones(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  var ventas = _ventas(sequelize, DataTypes);

  productos.belongsTo(categorias, { as: "id_categoria_categoria", foreignKey: "id_categoria"});
  categorias.hasMany(productos, { as: "productos", foreignKey: "id_categoria"});
  modelos.belongsTo(marcas, { as: "id_marca_marca", foreignKey: "id_marca"});
  marcas.hasMany(modelos, { as: "modelos", foreignKey: "id_marca"});
  productos.belongsTo(modelos, { as: "id_modelo_modelo", foreignKey: "id_modelo"});
  modelos.hasMany(productos, { as: "productos", foreignKey: "id_modelo"});
  detalle_ventas.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto"});
  productos.hasMany(detalle_ventas, { as: "detalle_venta", foreignKey: "id_producto"});
  stock.belongsTo(productos, { as: "id_producto_producto", foreignKey: "id_producto"});
  productos.hasMany(stock, { as: "stocks", foreignKey: "id_producto"});
  productos.belongsTo(proveedores, { as: "id_proveedor_proveedore", foreignKey: "id_proveedor"});
  proveedores.hasMany(productos, { as: "productos", foreignKey: "id_proveedor"});
  usuarios.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "id_rol"});
  productos.belongsTo(ubicaciones, { as: "id_ubicacion_ubicacione", foreignKey: "id_ubicacion"});
  ubicaciones.hasMany(productos, { as: "productos", foreignKey: "id_ubicacion"});
  ventas.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasMany(ventas, { as: "venta", foreignKey: "id_usuario"});
  detalle_ventas.belongsTo(ventas, { as: "id_venta_venta", foreignKey: "id_venta"});
  ventas.hasMany(detalle_ventas, { as: "detalle_venta", foreignKey: "id_venta"});

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
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
