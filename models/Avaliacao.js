const { DataTypes } = require("sequelize");
const { sequelize } = require("./db.js");

const Avaliacao = sequelize.define("avaliacoes", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Avaliacao;
