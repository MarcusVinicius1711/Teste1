const API_BASE = "https://studio55.onrender.com/api";

 
 
//SERVIÇOS
 
// AGENDAR
 
// ===== Seleção visual de dia e hora =====
document.querySelectorAll('.dias-semana button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dias-semana button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    horariosDiv.classList.add('visivel'); // mostra os horários
 
    atualizarHorariosDoDia(); // ← Atualiza horários bloqueados ao clicar no dia
  });
});
 
document.querySelectorAll('.horas button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.horas button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});
//input de nome e número
function mascaraTelefone(input) {
  // remove tudo que não for número
  let valor = input.value.replace(/\D/g, '');
 
  // formata conforme a quantidade de dígitos
  if (valor.length > 10) {
    // formato (11) 98765-4321
    valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (valor.length > 5) {
    // formato (11) 9876-5432
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (valor.length > 2) {
    // formato (11) 9
    valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    // formato (1
    valor = valor.replace(/^(\d*)/, '($1');
  }
 
  input.value = valor;
}
 
 
// ===== AGENDAR =====
const btnAgendar = document.getElementById('btnAgendar');
if (btnAgendar) {
  btnAgendar.addEventListener('click', async () => {
    const diaSelecionado = document.querySelector('.dias-semana button.selected');
    const horaSelecionada = document.querySelector('.horas button.selected');
    const servico = document.getElementById('Servicos').value;
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
 
    if (!diaSelecionado || !horaSelecionada || !servico || !nome || !telefone) {
      alert('Preencha todos os campos antes de agendar!');
      return;
    }
 
    const agendamento = {
      nome,
      telefone,
      servico,
      data: diaSelecionado.querySelector('small').innerText,
      horario: horaSelecionada.innerText
    };
 
    try {
      const res = await fetch(`${API_BASE}/agendamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamento)
      });
 
      const data = await res.json();
      alert(data.message || 'Agendamento realizado!');
 
      // Oculta o horário agendado imediatamente
      registrarHorarioOcupado(agendamento.data, agendamento.horario);
      atualizarHorariosDoDia();
 
      // Limpar seleção e inputs
      document.querySelectorAll('.dias-semana button').forEach(b => b.classList.remove('selected'));
      document.querySelectorAll('.horas button').forEach(b => b.classList.remove('selected'));
      document.getElementById('nome').value = '';
      document.getElementById('telefone').value = '';
 
      // Atualiza lista admin se estiver na página admin
      if (document.getElementById('agendamentos-container')) {
        carregarAgendamentos();
      }
 
    } catch (err) {
      console.error('Erro ao enviar agendamento:', err);
      alert('Erro ao agendar.');
    }
  });
}
 
const horariosDiv = document.querySelector('.horas');
 
// ====== Armazenamento local dos horários ocupados ======
let horariosOcupados = JSON.parse(localStorage.getItem('horariosOcupados')) || {};
 
function registrarHorarioOcupado(dia, hora) {
  if (!horariosOcupados[dia]) horariosOcupados[dia] = [];
  if (!horariosOcupados[dia].includes(hora)) {
    horariosOcupados[dia].push(hora);
  }
  localStorage.setItem('horariosOcupados', JSON.stringify(horariosOcupados));
}
 
function removerHorarioOcupado(dia, hora) {
  if (horariosOcupados[dia]) {
    horariosOcupados[dia] = horariosOcupados[dia].filter(h => h !== hora);
    localStorage.setItem('horariosOcupados', JSON.stringify(horariosOcupados));
  }
}
 
function atualizarHorariosDoDia() {
  const diaSelecionado = document.querySelector('.dias-semana button.selected');
  if (!diaSelecionado) return;
 
  const dataSelecionada = diaSelecionado.querySelector('small').innerText;
 
  document.querySelectorAll('.horas button').forEach(btn => {
    const hora = btn.innerText;
    const ocupado = horariosOcupados[dataSelecionada]?.includes(hora);
    btn.style.display = ocupado ? 'none' : 'inline-block';
  });
}
//========================================
document.addEventListener("DOMContentLoaded", () => {

  // Pega os parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const servicoSelecionado = params.get("servico");

  // Se existir parâmetro "servico"
  if (servicoSelecionado) {
    const select = document.getElementById("Servicos");

    // Define o valor no select
    select.value = servicoSelecionado;

    // Caso o valor não exista no select, não quebra
    if (select.value !== servicoSelecionado) {
      // Cria opção dinamicamente
      const novaOpcao = document.createElement("option");
      novaOpcao.value = servicoSelecionado;
      novaOpcao.textContent = servicoSelecionado;
      select.appendChild(novaOpcao);

      // Seleciona a nova opção
      select.value = servicoSelecionado;
    }
  }

});
//====AVALIAÇÕES====
 
 
 
 
// ===== ADMIN =====
async function carregarAgendamentos() {
  const container = document.getElementById('agendamentos-container');
  if (!container) return;
 
  container.innerHTML = '';
 
  try {
    const res = await fetch(`${API_BASE}/agendamentos`);
    if (!res.ok) throw new Error('Falha ao buscar agendamentos do servidor.');
    const agendamentos = await res.json();
 
    if (agendamentos.length === 0) {
      container.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
      return;
    }
 
    agendamentos.forEach(agendamento => {
      const divPai = document.createElement('div');
      divPai.classList.add('agendamento-pai');
 
      divPai.innerHTML = `
        <div>${agendamento.id}</div>
        <div>${agendamento.nome}</div>
        <div>${agendamento.telefone}</div>
        <div>${agendamento.servico}</div>
        <div>${agendamento.data}</div>
        <div>${agendamento.horario}</div>
        <div><button class="excluir-btn" data-id="${agendamento.id}" data-dia="${agendamento.data}" data-hora="${agendamento.horario}">Excluir</button></div>
      `;
 
      container.appendChild(divPai);
    });
 
    // Eventos de exclusão
    document.querySelectorAll('.excluir-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const dia = btn.getAttribute('data-dia');
        const hora = btn.getAttribute('data-hora');
 
        if (!confirm('Deseja realmente excluir este agendamento?')) return;
 
        try {
          const res = await fetch(`${API_BASE}/agendamento/${id}`, {
            method: 'DELETE'
          });
          const dataRes = await res.json();
          alert(dataRes.message || 'Agendamento excluído!');
 
          removerHorarioOcupado(dia, hora); // ← volta o horário ao disponível
          carregarAgendamentos();
        } catch (err) {
          console.error('Erro ao excluir agendamento:', err);
          alert('Erro ao excluir agendamento!');
        }
      });
    });
 
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err);
    container.innerHTML = '<p>Erro ao carregar agendamentos.</p>';
  }
}
 
// Carrega agendamentos ao abrir a página admin
document.addEventListener('DOMContentLoaded', () => {
  carregarAgendamentos();
  atualizarHorariosDoDia();
});
 
 
 
 
 
function enviarAvaliacao() {
  const nome = document.getElementById("nome").value;
  const texto = document.getElementById("texto").value;
 
  fetch("http://localhost:10000/avaliacoes", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, texto })
  })
  .then(res => res.text())
  .then(data => {
      if (data === "ok") {
          carregarAvaliacoes();
      }
  });
}
 
function carregarAvaliacoes() {
  fetch("http://localhost:10000/avaliacoes")
      .then(res => res.json())
      .then(avaliacoes => {
          const area = document.getElementById("lista-avaliacoes");
          area.innerHTML = "";
 
          avaliacoes.forEach(av => {
              area.innerHTML += `
                  <div class="card">
                      <h3>${av.nome}</h3>
                      <p>${av.texto}</p>
                  </div>
              `;
          });
      });
}
 
 
function enviarAvaliacao() {
  const nome = document.getElementById("nomeAvaliacao").value.trim();
  const texto = document.getElementById("textoAvaliacao").value.trim();
 
  if (!nome || !texto) {
      alert("Preencha todos os campos!");
      return;
  }
 
  fetch("http://localhost:10000/api/avaliacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, texto })
  })
  .then(res => res.json())
  .then(() => {
      document.getElementById("nomeAvaliacao").value = "";
      document.getElementById("textoAvaliacao").value = "";
      carregarAvaliacoes(); // ATUALIZA A LISTA NA HORA
  })
  .catch(err => console.error(err));
}
function enviarAvaliacao() {
  const nome = document.getElementById("nomeAvaliacao").value.trim();
  const texto = document.getElementById("textoAvaliacao").value.trim();
 
  if (!nome || !texto) {
      alert("Preencha todos os campos!");
      return;
  }
 
  fetch("https://studio55.onrender.com/api/avaliacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, texto })
  })
  .then(res => res.json())
  .then(() => {
      document.getElementById("nomeAvaliacao").value = "";
      document.getElementById("textoAvaliacao").value = "";
      carregarAvaliacoes(); // ATUALIZA A LISTA NA HORA
  })
  .catch(err => console.error(err));
}
 
function carregarAvaliacoes() {
  fetch("http://localhost:10000/api/avaliacoes")
  .then(res => res.json())
  .then(lista => {
      const container = document.querySelector("footer.avaliacoes");
      container.innerHTML = ""; // remove Helena, Luiza etc.
 
      lista.forEach(a => {
          container.innerHTML += `
              <div class="avaliacao-card">
                  <h3>${a.nome}</h3>
                  <p>${a.texto}</p>
              </div>
          `;
      });
  });
}
 
window.onload = () => {
  carregarAvaliacoes();
};
 
 