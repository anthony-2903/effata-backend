import { DataTypes } from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('stock', {
    id_stock: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id_producto'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW

    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stock',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_stock" },
        ]
      },
      {
        name: "id_producto",
        using: "BTREE",
        fields: [
          { name: "id_producto" },
        ]
      },
    ]
  });
};
