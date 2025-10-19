import { DataTypes } from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('marcas', {
    id_marca: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'marcas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_marca" },
        ]
      },
    ]
  });
};
