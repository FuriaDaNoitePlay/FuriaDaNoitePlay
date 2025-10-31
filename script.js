// === Botão fixo "Início" ===
document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".botao-inicio")) {
    const botao = document.createElement("button");
    botao.className = "botao-inicio";
    botao.textContent = "Início";
    botao.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.appendChild(botao);
  }

  // === Lista dos vídeos TikTok ===
  const videos = [
    "https://www.tiktok.com/embed/73939484748374",
    "https://vt.tiktok.com/ZSyFhosx7/",
    "https://vt.tiktok.com/ZSyFhosx7/"
  ];

  const container = document.getElementById("fron-videos");
  let index = 0;

  function mostrarProximoVideo() {
    if (!container) return;
    container.innerHTML = `
      <div class="video-box">
        <iframe src="${videos[index]}" allowfullscreen></iframe>
      </div>`;
    index = (index + 1) % videos.length;
  }

  mostrarProximoVideo();
  setInterval(mostrarProximoVideo, 15000);
});
