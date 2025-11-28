// server.js - CommonJS
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: './variaveis.env' });

const app = express();

// Importa conexões e models
const { sequelize } = require("./models/db.js");
const Usuario = require("./models/Usuario.js");
const Servico = require("./models/Servico.js");
const agendamento = require("./models/Agendamento.js");
const Avaliacao = require("./models/Avaliacao.js");

// Sincronização do banco
sequelize.sync({ alter: true })
  .then(() => console.log("Banco sincronizado!"))
  .catch(err => console.error("Erro ao sincronizar:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

// ===========================
// ROTAS
// ===========================

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});

// ===========================
// ROTAS DE AGENDAMENTOS
// ===========================

// Criar agendamento (Sequelize)
app.post('/api/agendamento', async (req, res) => {
  try {
    const { nome, telefone, servico, data, horario } = req.body;

    if (!nome || !telefone || !servico || !data || !horario) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const novo = await agendamento.create({ nome, telefone, servico, data, horario });

    res.json({ message: "Agendamento criado!", agendamento: novo });

  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
});

// Listar agendamentos
app.get('/api/agendamentos', async (req, res) => {
  try {
    const lista = await agendamento.findAll({
      order: [['data', 'ASC'], ['horario', 'ASC']]
    });

    res.json(lista);

  } catch (err) {
    console.error("Erro ao listar agendamentos:", err);
    res.status(500).json({ error: "Erro ao buscar agendamentos." });
  }
});

// Deletar agendamento
app.delete('/api/agendamento/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const apagado = await agendamento.destroy({ where: { id } });

    if (!apagado) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    res.json({ message: "Agendamento excluído!" });

  } catch (err) {
    console.error("Erro ao excluir:", err);
    res.status(500).json({ error: "Erro ao excluir." });
  }
});

// ===========================
// ROTAS DE AVALIAÇÕES
// ===========================

// Salvar avaliação
app.post("/api/avaliacoes", async (req, res) => {
  try {
    const { nome, texto } = req.body;

    if (!nome || !texto) {
      return res.status(400).json({ error: "Nome e texto são obrigatórios." });
    }

    const nova = await Avaliacao.create({ nome, texto });

    res.json({ message: "Avaliação enviada!", avaliacao: nova });

  } catch (err) {
    console.error("Erro ao salvar avaliação:", err);
    res.status(500).json({ error: "Erro ao salvar avaliação." });
  }
});

// Buscar avaliações
app.get("/api/avaliacoes", async (req, res) => {
  try {
    const lista = await Avaliacao.findAll({ order: [['id', 'DESC']] });
    res.json(lista);

  } catch (err) {
    console.error("Erro ao buscar avaliações:", err);
    res.status(500).json({ error: "Erro ao buscar avaliações." });
  }
});

// ===========================
// INICIAR SERVIDOR
// ===========================

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta " + PORT);
});
