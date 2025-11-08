<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔥 FuriaDaNoitePlay 🔥</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Oxanium:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    /* ===== RESET E CONFIGURAÇÕES GERAIS ===== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --vermelho-furia: #ff0000;
      --vermelho-escuro: #cc0000;
      --roxo-fron: #8a2be2;
      --azul-fron: #0000ff;
      --verde-adm: #00ff00;
      --preto: #0c0c0c;
      --cinza-escuro: #1a1a2e;
    }
    
    body {
      background: linear-gradient(135deg, var(--preto) 0%, var(--cinza-escuro) 50%, #16213e 100%);
      color: #fff;
      font-family: 'Orbitron', sans-serif;
      min-height: 100vh;
      text-align: center;
      overflow-x: hidden;
    }

    /* ===== CABEÇALHO ===== */
    header {
      background: rgba(0, 0, 0, 0.9);
      padding: 20px 0;
      border-bottom: 2px solid var(--vermelho-furia);
      box-shadow: 0 0 25px var(--vermelho-furia);
      position: relative;
      z-index: 100;
    }

    .logo {
      width: 160px;
      display: block;
      margin: 0 auto;
      border-radius: 10px;
      box-shadow: 0 0 30px var(--vermelho-furia);
    }

    .titulo {
      color: var(--vermelho-furia);
      font-size: 28px;
      text-transform: uppercase;
      text-shadow: 0 0 25px var(--vermelho-furia);
      margin: 15px 0;
    }

    /* ===== MENU ===== */
    nav {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;
    }

    nav a {
      color: #fff;
      text-decoration: none;
      background: rgba(255, 0, 0, 0.1);
      border: 2px solid var(--vermelho-furia);
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: bold;
      box-shadow: 0 0 15px var(--vermelho-furia);
      transition: all 0.3s ease;
    }

    nav a:hover {
      background-color: var(--vermelho-furia);
      color: #000;
      box-shadow: 0 0 25px var(--vermelho-furia);
      transform: translateY(-3px);
    }

    /* ===== CONTEÚDO PRINCIPAL ===== */
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .texto-intro {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid var(--vermelho-furia);
      border-radius: 12px;
      box-shadow: 0 0 25px var(--vermelho-furia);
      padding: 25px;
      margin-bottom: 30px;
      line-height: 1.6;
      text-align: left;
    }

    .texto-intro strong {
      color: #ff4444;
      text-shadow: 0 0 10px var(--vermelho-furia);
    }

    /* ===== SISTEMA FRØN ===== */
    .sistema-fron {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid var(--roxo-fron);
      border-radius: 12px;
      box-shadow: 0 0 25px var(--roxo-fron);
      padding: 25px;
      margin: 30px 0;
    }

    .btn-fron {
      background: linear-gradient(135deg, var(--roxo-fron), var(--azul-fron));
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px var(--roxo-fron);
      margin: 15px 0;
    }

    .btn-fron:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 30px var(--roxo-fron);
    }

    .status-fron {
      background: rgba(255, 0, 0, 0.2);
      border: 1px solid var(--vermelho-furia);
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
      color: var(--vermelho-furia);
      transition: all 0.3s ease;
    }

    /* ===== SISTEMA ADM ===== */
    .sistema-adm {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid var(--verde-adm);
      border-radius: 12px;
      box-shadow: 0 0 25px var(--verde-adm);
      padding: 25px;
      margin: 30px 0;
    }

    .login-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 400px;
      margin: 0 auto;
    }

    .input-adm {
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid var(--verde-adm);
      border-radius: 8px;
      padding: 12px 15px;
      color: white;
      font-family: 'Orbitron', sans-serif;
      box-shadow: 0 0 10px var(--verde-adm);
    }

    .btn-adm {
      background: linear-gradient(145deg, var(--verde-adm), #00cc00);
      color: #000;
      border: none;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px var(--verde-adm);
    }

    .btn-adm:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 30px var(--verde-adm);
    }

    .acesso-direto {
      background: linear-gradient(145deg, #ffd700, #ffaa00);
      color: #000;
      border: none;
      padding: 12px 25px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 10px 0;
    }

    .acesso-direto:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 20px #ffd700;
    }

    /* ===== SEÇÃO DE REDES SOCIAIS ===== */
    .redes-sociais {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
      margin: 40px 0;
    }

    .quadrado-social {
      width: 280px;
      height: 280px;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid var(--vermelho-furia);
      border-radius: 15px;
      box-shadow: 0 0 20px var(--vermelho-furia);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .quadrado-social:hover {
      transform: translateY(-10px);
      box-shadow: 0 0 30px var(--vermelho-furia);
    }

    .quadrado-social i {
      font-size: 50px;
      margin-bottom: 15px;
      color: var(--vermelho-furia);
      text-shadow: 0 0 15px var(--vermelho-furia);
    }

    .quadrado-social.instagram i {
      background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .quadrado-social.tiktok i {
      color: #000;
      text-shadow: 0 0 15px #00f2ea, 0 0 15px #ff0050;
    }

    .quadrado-social h3 {
      color: #fff;
      margin-bottom: 10px;
      font-size: 20px;
    }

    .quadrado-social p {
      color: #ccc;
      font-size: 14px;
      margin-bottom: 15px;
    }

    .btn-social {
      background: linear-gradient(135deg, var(--vermelho-furia), var(--vermelho-escuro));
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-social:hover {
      background: linear-gradient(135deg, var(--vermelho-escuro), var(--vermelho-furia));
      box-shadow: 0 0 15px var(--vermelho-furia);
      transform: scale(1.05);
    }

    /* ===== SEÇÃO DE VÍDEO ===== */
    .video-box {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid var(--vermelho-furia);
      border-radius: 12px;
      box-shadow: 0 0 25px var(--vermelho-furia);
      padding: 25px;
      margin: 40px 0;
    }

    .titulo-video {
      color: var(--vermelho-furia);
      text-shadow: 0 0 20px var(--vermelho-furia);
      margin-bottom: 20px;
      font-size: 24px;
    }

    .video-container {
      position: relative;
      width: 100%;
      max-width: 350px;
      margin: 0 auto;
    }

    iframe {
      width: 100%;
      height: 620px;
      border-radius: 10px;
      box-shadow: 0 0 20px var(--vermelho-furia);
    }

    /* ===== PLAYER DE MÚSICA ===== */
    .player-musica {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid var(--vermelho-furia);
      border-radius: 12px;
      box-shadow: 0 0 25px var(--vermelho-furia);
      padding: 25px;
      margin: 40px 0;
    }

    .player-musica h2 {
      color: var(--vermelho-furia);
      text-shadow: 0 0 20px var(--vermelho-furia);
      margin-bottom: 20px;
      font-size: 24px;
    }

    .controles-musica {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 20px;
    }

    .btn-musica {
      background: linear-gradient(135deg, var(--vermelho-furia), var(--vermelho-escuro));
      color: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-musica:hover {
      background: linear-gradient(135deg, var(--vermelho-escuro), var(--vermelho-furia));
      box-shadow: 0 0 15px var(--vermelho-furia);
      transform: scale(1.1);
    }

    /* ===== BOTÃO WHATSAPP ===== */
    .btn-whatsapp {
      position: fixed;
      bottom: 100px;
      right: 30px;
      background: #25D366;
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      box-shadow: 0 0 20px #25D366;
      z-index: 1000;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .btn-whatsapp:hover {
      transform: scale(1.1);
      box-shadow: 0 0 30px #25D366;
    }

    /* ===== EQUIPE ADM ===== */
    .adm-box {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid var(--vermelho-furia);
      border-radius: 12px;
      box-shadow: 0 0 25px var(--vermelho-furia);
      padding: 25px;
      margin-bottom: 40px;
    }

    .adm-box h2 {
      color: var(--vermelho-furia);
      text-shadow: 0 0 20px var(--vermelho-furia);
      margin-bottom: 20px;
      font-size: 24px;
    }

    .adm-box ul {
      list-style: none;
      text-align: left;
      max-width: 600px;
      margin: 0 auto;
    }

    .adm-box li {
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 0, 0, 0.3);
    }

    .adm-box strong {
      color: #ff4444;
      text-shadow: 0 0 10px var(--vermelho-furia);
    }

    /* ===== RODAPÉ ===== */
    footer {
      color: var(--vermelho-furia);
      text-shadow: 0 0 15px var(--vermelho-furia);
      border-top: 2px solid var(--vermelho-furia);
      padding: 20px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.9);
      margin-top: 40px;
    }

    .destaque {
      color: #FFD700;
      text-shadow: 0 0 20px #FFD700;
    }

    .assinatura {
      color: var(--vermelho-furia);
      text-shadow: 0 0 10px var(--vermelho-furia);
    }

    /* ===== BOTÃO INÍCIO ===== */
    .botao-inicio {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #FFD700;
      color: #000;
      border: none;
      border-radius: 30px;
      padding: 14px 30px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 0 25px #FFD700;
      cursor: pointer;
      transition: transform 0.2s ease;
      z-index: 999;
    }

    .botao-inicio:hover {
      transform: scale(1.05);
      box-shadow: 0 0 35px #FFD700;
    }

    /* ===== ANIMAÇÕES ===== */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .pulse {
      animation: pulse 2s infinite;
    }

    @keyframes fadeOut {
      to { opacity: 0; }
    }

    /* ===== RESPONSIVIDADE ===== */
    @media (max-width: 768px) {
      .redes-sociais {
        flex-direction: column;
        align-items: center;
      }
      
      .quadrado-social {
        width: 100%;
        max-width: 300px;
      }
      
      iframe {
        height: 500px;
      }
      
      nav {
        flex-direction: column;
        align-items: center;
      }
      
      nav a {
        width: 80%;
        text-align: center;
      }
    }
  </style>
</head>

<body>

  <!-- ====== CABEÇALHO ====== -->
  <header>
    <img src="https://via.placeholder.com/160x80/ff0000/000000?text=FRØN" alt="Logo Fúria da Noite" class="logo">
    <h1 class="titulo">🔥 FuriaDaNoitePlay 🔥</h1>
    <nav>
      <a href="index.html">Início</a>
      <a href="membros.html">Membros</a>
      <a href="regras.html">Regras</a>
      <a href="login.html">Login</a>
      <a href="campeonato.html">Campeonato</a>
    </nav>
  </header>

  <!-- ====== CONTEÚDO PRINCIPAL ====== -->
  <main>
    <section class="texto-intro">
      <p>
        Seja bem-vindo ao clã <strong>Fúria!</strong><br>
        Aqui somos competitivos e casuais, unidos pela paixão pelo jogo e pela amizade.<br>
        Venha fazer parte da Fúria, onde estamos sempre online, juntos com a Lua.<br><br>
        Eles pensaram que a Lua seria deles... mas quando ela revela sua verdadeira face,<br>
        a escuridão surge com toda a sua força.<br><br>
        Prepare-se para entrar na <strong>FuriaDaNoitePlay</strong> e mostrar que aqui,
        quem manda é a verdadeira fúria!
      </p>
    </section>

    <!-- ====== SISTEMA FRØN ====== -->
    <section class="sistema-fron">
      <h2>⚡ SISTEMA FRØN ⚡</h2>
      <p>Ative o poder máximo do sistema FRØN</p>
      <button class="btn-fron" id="btnFron">
        <i class="fas fa-fire"></i> FRØN
      </button>
      <div class="status-fron" id="fronStatus">
        Sistema FRØN: AGUARDANDO ATIVAÇÃO
      </div>
    </section>

    <!-- ====== SISTEMA ADM SUPREMO ====== -->
    <section class="sistema-adm">
      <h2>👑 SISTEMA ADM SUPREMO 👑</h2>
      <p>Acesso completo ao painel administrativo</p>
      
      <div class="login-container">
        <input type="text" id="usuarioAdm" class="input-adm" placeholder="Usuário ADM" value="FURIAGOD">
        <input type="password" id="senhaAdm" class="input-adm" placeholder="Senha" value="Furia2025_$">
        <button class="btn-adm" onclick="fazerLoginAdm()">
          🚀 ACESSAR PAINEL ADM COMPLETO
        </button>
      </div>
      
      <button class="acesso-direto" onclick="acessoDireto()">
        🎮 ACESSO DIRETO AO JOGO
      </button>
    </section>

    <!-- ====== REDES SOCIAIS ====== -->
    <div class="redes-sociais">
      <div class="quadrado-social instagram">
        <i class="fab fa-instagram"></i>
        <h3>Instagram FRØN</h3>
        <p>Confira nossas últimas postagens e novidades</p>
        <a href="https://www.instagram.com/p/DQy5viLDpyP/?igsh=MW1lZjlzZTNwdmh6MQ==" target="_blank" class="btn-social">
          Ver Postagem
        </a>
      </div>
      
      <div class="quadrado-social tiktok">
        <i class="fab fa-tiktok"></i>
        <h3>TikTok FRØN</h3>
        <p>Vídeos curtos e conteúdos exclusivos</p>
        <a href="https://vt.tiktok.com/ZSyQnRjDM/" target="_blank" class="btn-social">
          Ver TikTok
        </a>
      </div>
    </div>

    <!-- ====== VÍDEO SEÇÃO ====== -->
    <section class="video-box">
      <h2 class="titulo-video">🎬 Destaque da Semana</h2>
      <div class="video-container">
        <iframe width="350" height="620"
          src="https://www.youtube.com/embed/H6_nnRecvv4"
          title="Short - FúriaDaNoitePlay"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </section>

    <!-- ====== PLAYER DE MÚSICA ====== -->
    <section class="player-musica">
      <h2>🎵 Trilha Sonora FRØN</h2>
      <p>Ouça a música tema da FuriaDaNoitePlay</p>
      <div class="controles-musica">
        <button class="btn-musica" onclick="toggleMusica()" id="btnPlay">
          <i class="fas fa-play"></i>
        </button>
        <button class="btn-musica" onclick="stopMusica()">
          <i class="fas fa-stop"></i>
        </button>
      </div>
      <audio id="musica" loop>
        <!-- Adicione aqui o link da música -->
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </section>

    <!-- ====== EQUIPE ADM ====== -->
    <section class="adm-box">
      <h2>👑 Equipe ADM — FuriaDaNoitePlay</h2>
      <ul>
        <li><strong>@ToxicSkull√</strong> — "A noite brilha sob nossa fúria." 🌙🔥</li>
        <li><strong>Scorpion Game</strong> — "Veneno no foco, vitória na mira." 🦂</li>
        <li><strong>NeferpitouI</strong> — "Caos e controle na mesma energia." 💫</li>
        <li><strong>༄Son_king</strong> — "Rei das sombras, dono da noite." 👑</li>
      </ul>
    </section>
  </main>

  <!-- ====== BOTÃO WHATSAPP ====== -->
  <a href="https://wa.me/553197319008" target="_blank" class="btn-whatsapp pulse">
    <i class="fab fa-whatsapp"></i>
  </a>

  <!-- ====== RODAPÉ ====== -->
  <footer>
    <p>© 2025 <span class="destaque">FuriaDaNoitePlay</span> — 
    <span class="assinatura">@ToxicSkull√</span></p>
  </footer>

  <!-- ====== BOTÃO FIXO ====== -->
  <button class="botao-inicio" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">🏠 Início</button>

  <script>
    // =============================================
    // SISTEMA COMPLETO - FRØN + ADM SUPREMO
    // =============================================

    // ===== SISTEMA FRØN =====
    const btnFron = document.getElementById('btnFron');
    const fronStatus = document.getElementById('fronStatus');
    
    let fronAtivo = false;
    let contadorCliques = 0;
    
    // Função principal do botão FRØN
    btnFron.addEventListener('click', function() {
      contadorCliques++;
      
      if (!fronAtivo) {
        // Ativar FRØN
        fronAtivo = true;
        fronStatus.textContent = `FRØN ATIVADO! Sistema em funcionamento - Cliques: ${contadorCliques}`;
        fronStatus.style.background = 'rgba(0, 255, 0, 0.2)';
        fronStatus.style.border = '1px solid #00ff00';
        fronStatus.style.color = '#00ff00';
        btnFron.style.background = 'linear-gradient(135deg, #00ff00, #008800, #006600)';
        btnFron.innerHTML = '<i class="fas fa-check"></i> FRØN ATIVO';
        
        // Efeito visual
        btnFron.style.transform = 'scale(1.2)';
        setTimeout(() => {
          btnFron.style.transform = 'translateY(-5px) scale(1.08)';
        }, 200);
      } else {
        // Desativar FRØN
        fronAtivo = false;
        fronStatus.textContent = `Sistema FRØN: DESATIVADO - Total de cliques: ${contadorCliques}`;
        fronStatus.style.background = 'rgba(255, 0, 0, 0.2)';
        fronStatus.style.border = '1px solid #ff0000';
        fronStatus.style.color = '#ff0000';
        btnFron.style.background = 'linear-gradient(135deg, #8a2be2, #4b0082, #0000ff)';
        btnFron.innerHTML = '<i class="fas fa-fire"></i> FRØN';
      }
    });

    // ===== SISTEMA ADM SUPREMO =====
    // 🎯 ACESSO DIRETO SEM LOGIN
    function acessoDireto() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: radial-gradient(circle, rgba(0,255,0,0.3) 0%, transparent 70%);
            animation: fadeOut 1s forwards;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(effect);
        
        setTimeout(() => {
            alert('🎉 ACESSO LIVRE CONFIRMADO! Redirecionando para o jogo...');
            window.location.href = 'md1.html';
        }, 800);
    }

    // 🔑 SISTEMA DE LOGIN - MELHORADO
    function fazerLoginAdm() {
        const usuario = document.getElementById('usuarioAdm').value.trim();
        const 