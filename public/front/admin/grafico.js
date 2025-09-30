// grafico.js

let graficoChamados;

async function carregarDados() {
  try {
    const resposta = await fetch("/api/chamados"); // rota do backend
    const dados = await resposta.json();

    let alta = 0, media = 0, baixa = 0;

    dados.forEach(item => {
      if (item.prioridade.toLowerCase() === "alta") alta = item.total;
      if (item.prioridade.toLowerCase() === "média" || item.prioridade.toLowerCase() === "media") media = item.total;
      if (item.prioridade.toLowerCase() === "baixa") baixa = item.total;
    });

    atualizarGrafico([alta, media, baixa]);
  } catch (erro) {
    console.error("Erro ao carregar dados do banco:", erro);
  }
}

function inicializarGrafico() {
  const ctx = document.getElementById("graficoChamados").getContext("2d");

  graficoChamados = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Prioridade Alta", "Prioridade Média", "Prioridade Baixa"],
      datasets: [{
        label: "Chamados",
        data: [0, 0, 0],
        backgroundColor: ["#b82020", "#ffb700", "#06a36a"],
        borderColor: "#f4f6f9",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  carregarDados(); // parte para buscar dados do banco e criar o grafico!
}

function atualizarGrafico(valores) {
  graficoChamados.data.datasets[0].data = valores;
  graficoChamados.update();
}

document.addEventListener("DOMContentLoaded", inicializarGrafico);
