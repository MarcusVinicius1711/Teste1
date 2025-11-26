const { DataTypes } = require("sequelize");
const { sequelize } = require("./db.js");

const Usuario = sequelize.define("usuarios", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Usuario;
