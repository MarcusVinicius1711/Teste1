const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const postgres = require("pg");
dotenv.config({ path: "./.env" });


// Exemplo para MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectModule: postgres,
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
