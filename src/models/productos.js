import { DataTypes } from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('productos', {
    id_producto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codigo_proveedor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    codigo_almacen: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: "codigo_almacen"
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio_minimo: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    precio_estandar: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id_categoria'
      }
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedores',
        key: 'id_proveedor'
      }
    },
    id_modelo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'modelos',
        key: 'id_modelo'
      }
    },
    id_ubicacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ubicaciones',
        key: 'id_ubicacion'
      }
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'productos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_producto" },
        ]
      },
      {
        name: "codigo_almacen",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "codigo_almacen" },
        ]
      },
      {
        name: "id_categoria",
        using: "BTREE",
        fields: [
          { name: "id_categoria" },
        ]
      },
      {
        name: "id_proveedor",
        using: "BTREE",
        fields: [
          { name: "id_proveedor" },
        ]
      },
      {
        name: "id_modelo",
        using: "BTREE",
        fields: [
          { name: "id_modelo" },
        ]
      },
      {
        name: "id_ubicacion",
        using: "BTREE",
        fields: [
          { name: "id_ubicacion" },
        ]
      },
    ]
  });
};
