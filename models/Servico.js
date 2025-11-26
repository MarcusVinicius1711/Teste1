const { DataTypes } = require("sequelize");
const { sequelize } = require("./db.js");

const Servicos = sequelize.define("servicos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  categoria: {
    type: DataTypes.ENUM("Corte", "Coloração", "Penteado"),
    allowNull: false
  },
  nome_servico: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: false   // ✔️ AGORA ESTÁ NO LUGAR CERTO
});

module.exports = Servicos;
