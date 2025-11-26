const Servico = require("./models/Servico.js");
const { sequelize } = require("./db.js");

async function seed() {
  await sequelize.sync();

  const servicosData = [
    { categoria: "Corte", nome_servico: "Corte reto", preco: 150.00 },
    { categoria: "Corte", nome_servico: "Corte em camadas", preco: 200.00 },
    { categoria: "Corte", nome_servico: "Corte chanel", preco: 130.00 },
    { categoria: "Corte", nome_servico: "Corte pixie", preco: 130.00 },
    { categoria: "Corte", nome_servico: "Wolf cut", preco: 95.00 },
    { categoria: "Corte", nome_servico: "Butterfly haircut", preco: 150.00 },
    { categoria: "Coloração", nome_servico: "Ruivo", preco: 700.00 },
    { categoria: "Coloração", nome_servico: "Loiro Global", preco: 1500.00 },
    { categoria: "Coloração", nome_servico: "Platinado", preco: 1200.00 },
    { categoria: "Coloração", nome_servico: "Luzes", preco: 750.00 },
    { categoria: "Coloração", nome_servico: "Preto Natural", preco: 250.00 },
    { categoria: "Coloração", nome_servico: "Castanho Iluminado", preco: 400.00 },
    { categoria: "Penteado", nome_servico: "Semi Preso", preco: 120.00 },
    { categoria: "Penteado", nome_servico: "Trança", preco: 180.00 },
    { categoria: "Penteado", nome_servico: "Coque Trançado", preco: 220.00 },
    { categoria: "Penteado", nome_servico: "Coque Despojado", preco: 170.00 },
    { categoria: "Penteado", nome_servico: "Trança boxeadora", preco: 120.00 },
    { categoria: "Penteado", nome_servico: "Trança Cascata", preco: 200.00 }
  ];

  await Servico.bulkCreate(servicosData, { ignoreDuplicates: true });

  console.log("Serviços inseridos!");
  process.exit();
}

seed();
