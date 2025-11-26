// server.js - CommonJS
const path = require('path');
 
const express = require('express');
 
const mysql = require('mysql2');
 
const cors = require('cors');
 
const dotenv = require('dotenv');
 
 
 
dotenv.config({ path: './variaveis.env' });
 
 
 
const app = express();
 
const { sequelize } = require("./models/db.js");
require("./models/Usuario.js");
require("./models/Servico.js");
require("./models/Agendamento.js");

sequelize.sync({ alter: true })
  .then(() => console.log("Banco sincronizado!"))
  .catch(err => console.error("Erro ao sincronizar:", err));

 
// Middleware
 
app.use(cors());
 
app.use(express.json());
 
app.use(express.urlencoded({ extended: true }));
 
app.use(express.static(__dirname)); // serve todos os arquivos estáticos da pasta atual
 
 
 
// Conexão com MySQL
 
const db = mysql.createPool({
 
  host: process.env.DB_HOST,
 
  user: process.env.DB_USER,
 
  password: process.env.DB_PASSWORD,
 
  database: process.env.DB_NAME,
 
  port: process.env.DB_PORT
 
});
 
 
 
// Teste de conexão
 
db.getConnection((err, connection) => {
 
  if (err) {
 
    console.error('Erro ao conectar ao MySQL:', err);
 
  } else {
 
    console.log('Conectado ao MySQL com sucesso!');
 
    connection.release();
 
  }
 
});
 
 
 
// ROTAS
 
 
 
// Rota raiz
 
app.get('/', (req, res) => {
 
  res.sendFile(path.join(__dirname, 'index.html'));
 
});
 
 
 
// Criar agendamento
 
app.post('/api/agendamento', (req, res) => {
 
  const { nome, telefone, servico, data, horario } = req.body;
 
 
 
  console.log('Recebendo agendamento:', req.body); // log detalhado
 
 
 
  if (!nome || !telefone || !servico || !data || !horario) {
 
    console.log('Falha: algum campo não foi preenchido.');
 
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
 
  }
 
 
 
  const sql = 'INSERT INTO agendamentos (nome, telefone, servico, data, horario) VALUES (?, ?, ?, ?, ?)';
 
  db.query(sql, [nome, telefone, servico, data, horario], (err, result) => {
 
    if (err) {
 
      console.error('Erro ao inserir agendamento:', err);
 
      return res.status(500).json({ error: 'Erro ao salvar agendamento no banco.' });
 
    }
 
    console.log('Agendamento inserido com sucesso:', result);
 
    res.json({ message: 'Agendamento realizado com sucesso!' });
 
  });
 
});
 
 
 
// Listar agendamentos (admin)
 
app.get('/api/agendamentos', (req, res) => {
 
  const sql = 'SELECT * FROM agendamentos ORDER BY data, horario';
 
  db.query(sql, (err, results) => {
 
    if (err) {
 
      console.error('Erro ao buscar agendamentos:', err);
 
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
 
    }
 
    console.log('Agendamentos retornados:', results.length);
 
    res.json(results);
 
  });
 
});
 
 
 
// Deletar agendamento
 
app.delete('/api/agendamento/:id', (req, res) => {
 
  const { id } = req.params;
 
  console.log('Excluindo agendamento ID:', id);
 
 
 
  const sql = 'DELETE FROM agendamentos WHERE id = ?';
 
  db.query(sql, [id], (err, result) => {
 
    if (err) {
 
      console.error('Erro ao deletar agendamento:', err);
 
      return res.status(500).json({ error: 'Erro ao deletar agendamento' });
 
    }
 
    console.log('Agendamento deletado:', result);
 
    res.json({ message: 'Agendamento excluído com sucesso!' });
 
  });
 
});
 
 
 
// ========================
 
// ROTAS DE AVALIAÇÕES
 
// ========================
 
 
 
// SALVAR AVALIAÇÃO
 
app.post("/api/avaliacoes", (req, res) => {
 
  const { nome, texto } = req.body;
 
 
 
  if (!nome || !texto) {
 
    return res.status(400).json({ error: "Nome e texto são obrigatórios." });
 
  }
 
 
 
  const sql = "INSERT INTO avaliacoes (nome, texto) VALUES (?, ?)";
 
  db.query(sql, [nome, texto], (err, result) => {
 
    if (err) {
 
      console.error("Erro ao salvar:", err);
 
      return res.status(500).json({ error: "Erro ao salvar avaliação." });
 
    }
 
    res.json({ message: "Avaliação enviada!" });
 
  });
 
});
 
 
 
// BUSCAR AVALIAÇÕES
 
app.get("/api/avaliacoes", (req, res) => {
 
  const sql = "SELECT * FROM avaliacoes ORDER BY id DESC";
 
  db.query(sql, (err, rows) => {
 
    if (err) return res.status(500).json({ error: "Erro ao buscar" });
 
    res.json(rows);
 
  });
 
});
 
 
 
// =========================
 
// INICIAR SERVIDOR (APENAS UM)
 
// =========================
 
const PORT = process.env.PORT || 10000;
 
app.listen(PORT,"0.0.0.0", () => {
 
  console.log("Servidor rodando na porta " + PORT);
 
});
 
 
 
 