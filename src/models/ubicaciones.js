const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ubicaciones', {
    id_ubicacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    torre: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    piso: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    seccion: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ubicaciones',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ubicacion" },
        ]
      },
    ]
  });
};
