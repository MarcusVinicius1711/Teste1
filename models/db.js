const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const mysql2 = require("mysql2");
dotenv.config({ path: "./.env" });


// Exemplo para MySQL
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: "mysql",
    dialectModule: mysql2,
    logging: false,
    pool: {max: 5, min: 0, idle:30000, acquire: 10000}
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("Erro ao se conectar ao banco de dados" + error);
  }
})();


module.exports = { Sequelize, sequelize };
