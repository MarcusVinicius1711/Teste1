
const quadrados = document.querySelectorAll('.quadrado');
 
    quadrados.forEach(div => {
      div.addEventListener('click', () => {
        const servico = div.dataset.servico;
        // Redireciona com o parâmetro na URL
        window.location.href = `agendar.html?servico=${encodeURIComponent(servico)}`;
      });
    });
 
    