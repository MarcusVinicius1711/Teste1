const { DataTypes } = require("sequelize");
const { sequelize } = require("./db.js");

const Agendamento = sequelize.define("agendamentos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(255)
  },
  telefone: {
    type: DataTypes.STRING(20)
  },
  servico: {
    type: DataTypes.STRING(100)
  },
  data: {
    type: DataTypes.STRING(20)   // você estava usando VARCHAR(20)
  },
  horario: {
    type: DataTypes.STRING(10)
  }
});

module.exports = Agendamento;
