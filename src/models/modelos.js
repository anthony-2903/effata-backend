import { DataTypes } from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('modelos', {
    id_modelo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    anio_inicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    anio_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_marca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'marcas',
        key: 'id_marca'
      }
    }
  }, {
    sequelize,
    tableName: 'modelos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_modelo" },
        ]
      },
      {
        name: "id_marca",
        using: "BTREE",
        fields: [
          { name: "id_marca" },
        ]
      },
    ]
  });
};
