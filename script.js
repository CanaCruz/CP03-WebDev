const baseFrases = [
  { frase: "Vacina causa autismo", status: "falso" },
  { frase: "Terra é plana", status: "falso" },
  { frase: "Máscaras ajudam a prevenir doenças", status: "verdadeiro" },
  { frase: "A vacina da gripe causa gripe", status: "falso" },
  { frase: "Mudanças climáticas são reais", status: "verdadeiro" },
  { frase: "5G causa COVID-19", status: "falso" },
  { frase: "Beber água evita infecções", status: "verdadeiro" },
  { frase: "Remédio X cura câncer", status: "falso" },
  { frase: "Óleo de coco emagrece", status: "falso" },
  { frase: "Exercícios físicos melhoram a saúde", status: "verdadeiro" }
];

function verificarFrase() {
  const input = document.getElementById("fraseInput").value.trim().toLowerCase();
  const resultadoDiv = document.getElementById("resultado");
  const dataHora = new Date().toLocaleString();

  const encontrada = baseFrases.find(f => f.frase.toLowerCase() === input);
  let resultadoHTML = "";

  if (encontrada) {
    const status = encontrada.status === "verdadeiro" ? "Fato Verificado ✅" : "Fake News ❌";
    const classe = encontrada.status === "verdadeiro" ? "verdadeiro" : "falso";
    const explicacao = encontrada.status === "verdadeiro"
      ? "Essa frase é confirmada por fontes confiáveis."
      : "Essa frase é falsa e não tem base científica.";
    resultadoHTML = `<p class="${classe}">${status}</p><p>${explicacao}</p>`;

    salvarHistorico(input, dataHora, status);
  } else {
    resultadoHTML = `<p>Frase não encontrada na base. Buscando em fontes externas...</p>`;
  }

  resultadoDiv.innerHTML = resultadoHTML;
  buscarNoticias(input);
}

function salvarHistorico(frase, dataHora, resultado) {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  historico.push({ frase, dataHora, resultado });
  localStorage.setItem("historico", JSON.stringify(historico));
}

function mostrarHistorico() {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  let html = "<table><tr><th>Frase</th><th>Data/Hora</th><th>Resultado</th></tr>";

  historico.forEach(item => {
    html += `<tr><td>${item.frase}</td><td>${item.dataHora}</td><td>${item.resultado}</td></tr>`;
  });

  html += "</table>";
  document.getElementById("historico").innerHTML = html;
}

function buscarNoticias(palavraChave) {
  const apiKey = '132b1325f1fcbda72ac4d496681cc668'; 
  const apiDiv = document.getElementById("apiResultados");

  fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(palavraChave)}&token=${apiKey}&lang=pt`)
    .then(res => res.json())
    .then(data => {
      if (data.articles && data.articles.length > 0) {
        let html = "<h3>Notícias relacionadas:</h3><ul>";
        data.articles.forEach(n => {
          html += `<li><a href="${n.url}" target="_blank">${n.title}</a></li>`;
        });
        html += "</ul>";
        apiDiv.innerHTML = html;
      } else {
        apiDiv.innerHTML = "<p>Nenhuma notícia encontrada.</p>";
      }
    })
    .catch(() => {
      apiDiv.innerHTML = "<p>Erro ao buscar notícias externas.</p>";
    });
}

// Ativa os botões depois que o HTML tiver carregado
window.onload = () => {
  document.getElementById("btnVerificar").addEventListener("click", verificarFrase);
  document.getElementById("btnHistorico").addEventListener("click", mostrarHistorico);
};
