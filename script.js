<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>👑 ADM SUPREMO - Sistema 100% Liberado</title>
    <style>
        :root {
            --adm-vermelho: #ff0000;
            --adm-amarelo: #ffff00;
            --adm-verde: #00ff00;
            --fundo-escuro: #0a0a0a;
        }

        body {
            background: linear-gradient(135deg, #1a0a0a, #0a0a0a, #001a0a);
            color: #ffff00;
            font-family: 'Courier New', monospace;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        /* HEADER ADM */
        .adm-header {
            text-align: center;
            padding: 30px;
            margin-bottom: 40px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 15px;
            border: 3px solid var(--adm-verde);
            box-shadow: 0 0 30px var(--adm-verde);
            position: relative;
            overflow: hidden;
        }

        .adm-header::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 0, 0.1), transparent);
            animation: brilho-adm 6s linear infinite;
        }

        @keyframes brilho-adm {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .adm-title {
            font-size: 2.5rem;
            color: var(--adm-verde);
            text-shadow: 0 0 20px var(--adm-verde);
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
        }

        .adm-subtitle {
            color: var(--adm-verde);
            text-shadow: 0 0 10px var(--adm-verde);
            font-size: 1.1rem;
            position: relative;
            z-index: 2;
        }

        /* STATUS DO SISTEMA */
        .status-sistema {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }

        .status-item {
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            border: 2px solid var(--adm-verde);
            box-shadow: 0 0 15px var(--adm-verde);
        }

        .status-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin: 0 auto 10px;
            background: var(--adm-verde);
            box-shadow: 0 0 10px var(--adm-verde);
        }

        /* ACESSO LIVRE */
        .acesso-livre {
            background: rgba(0, 255, 0, 0.1);
            border: 2px solid var(--adm-verde);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 0 20px var(--adm-verde);
        }

        /* BOTÕES */
        .btn-adm {
            padding: 18px 30px;
            border: none;
            border-radius: 25px;
            font-weight: bold;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Courier New', monospace;
            background: linear-gradient(45deg, var(--adm-verde), #00cc00);
            color: #000;
            box-shadow: 0 0 20px var(--adm-verde);
            margin: 10px;
            width: 90%;
        }

        .btn-adm:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px var(--adm-verde);
        }

        .btn-modo {
            background: linear-gradient(45deg, #ff0000, #ffff00);
            color: #000;
        }

        .btn-redes {
            background: linear-gradient(45deg, #ff0000, #ff00ff);
            color: #000;
            padding: 12px 20px;
            font-size: 1rem;
            width: auto;
        }

        .login-container {
            background: rgba(0, 0, 0, 0.9);
            padding: 40px;
            border-radius: 15px;
            border: 3px solid var(--adm-verde);
            box-shadow: 0 0 25px var(--adm-verde);
            margin-bottom: 30px;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }

        .input-group label {
            color: var(--adm-verde);
            font-weight: bold;
            text-shadow: 0 0 10px var(--adm-verde);
            font-size: 1.1rem;
        }

        .input-group input {
            padding: 15px;
            border: 2px solid var(--adm-verde);
            border-radius: 10px;
            background: rgba(0, 255, 0, 0.1);
            color: white;
            font-size: 1rem;
            font-family: 'Courier New', monospace;
        }

        @media (max-width: 768px) {
            .status-sistema {
                grid-template-columns: 1fr;
            }
            .adm-title {
                font-size: 2rem;
            }
            .login-container {
                padding: 25px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER ADM -->
        <header class="adm-header">
            <h1 class="adm-title">👑 SISTEMA 100% LIBERADO</h1>
            <p class="adm-subtitle">ACESSO TOTAL - Todos os Modos Ativos</p>
        </header>

        <!-- STATUS DO SISTEMA -->
        <div class="status-sistema">
            <div class="status-item">
                <div class="status-indicator"></div>
                <div>🌐 SISTEMA ONLINE</div>
                <small>ACESSO LIVRE</small>
            </div>
            <div class="status-item">
                <div class="status-indicator"></div>
                <div>🎮 MODOS ATIVOS</div>
                <small>TRUCU + FÚRIA</small>
            </div>
            <div class="status-item">
                <div class="status-indicator"></div>
                <div>🔓 SEGURANÇA</div>
                <small>MODO PÚBLICO</small>
            </div>
        </div>

        <!-- ACESSO LIVRE -->
        <div class="acesso-livre">
            <h3>🎯 ACESSO IMEDIATO - SEM LOGIN</h3>
            <button class="btn-adm" onclick="acessoDireto()">
                🎮 ENTRAR DIRETO NO JOGO
            </button>
        </div>

        <!-- MODOS DE JOGO -->
        <div class="acesso-livre">
            <h3>🕹️ MODOS DE JOGO</h3>
            <button class="btn-adm btn-modo" onclick="abrirMD('md1')">
                🎯 TRUCU PAULISTA
            </button>
            <button class="btn-adm btn-modo" onclick="abrirMD('md2')">
                ⚡ MODO FÚRIA
            </button>
            <button class="btn-adm btn-modo" onclick="abrirMD('md3')">
                👥 MODO EQUIPE
            </button>
        </div>

        <!-- LOGIN ADM (OPCIONAL) -->
        <div class="login-container">
            <h3 style="text-align: center; color: var(--adm-verde);">🔑 LOGIN ADM (OPCIONAL)</h3>
            <div class="input-group">
                <label>👑 USUÁRIO:</label>
                <input type="text" id="usuarioAdm" value="FURIAGOD">
            </div>
            <div class="input-group">
                <label>🔒 SENHA:</label>
                <input type="password" id="senhaAdm" value="Furia2025_$">
            </div>
            <button class="btn-adm" onclick="fazerLoginAdm()">
                🚀 ACESSAR PAINEL ADM
            </button>
        </div>

        <!-- REDES SOCIAIS -->
        <div class="acesso-livre">
            <h3>📱 REDES OFICIAIS</h3>
            <button class="btn-adm btn-redes" onclick="abrirInstagram()">📸 Instagram</button>
            <button class="btn-adm btn-redes" onclick="abrirYouTube()">🎥 YouTube</button>
            <button class="btn-adm btn-redes" onclick="abrirTikTok()">🎵 TikTok</button>
            <button class="btn-adm btn-redes" onclick="abrirWhatsApp()">💬 WhatsApp</button>
        </div>
    </div>

    <script>
        // =============================================
        // SISTEMA 100% LIBERADO - CONFIGURAÇÕES ATUALIZADAS
        // =============================================

        // 🎯 ACESSO DIRETO SEM LOGIN
        function acessoDireto() {
            alert('🎉 ACESSO LIVRE CONFIRMADO! Redirecionando para o jogo...');
            window.location.href = 'md1.html'; // Página principal do jogo
        }

        // 🕹️ FUNÇÕES DE NAVEGAÇÃO - ATUALIZADAS
        function abrirMD(md) {
            if (md === 'md1') {
                window.location.href = 'md1.html';
            } else if (md === 'md2') {
                window.location.href = 'md2.html';
            } else if (md === 'md3') {
                // MODO EQUIPE - ACESSO LIVRE
                window.location.href = 'md3.html';
            }
        }

        function abrirLoginAdm() {
            window.location.href = 'login-adm.html';
        }

        function abrirLoginEquipe() {
            // ACESSO LIVRE - SEM LOGIN OBRIGATÓRIO
            window.location.href = 'md3.html';
        }

        function abrirCadastroMembro() {
            window.location.href = 'cadastro-membro.html';
        }

        function abrirCadastroEquipe() {
            window.location.href = 'cadastro-equipe.html';
        }

        // 🔑 SISTEMA DE LOGIN - LIBERADO
        function fazerLoginAdm() {
            const usuario = document.getElementById('usuarioAdm').value;
            const senha = document.getElementById('senhaAdm').value;
            
            // CREDENCIAIS ADM LIBERADAS
            const adms = {
                'FURIAGOD': 'Furia2025_$',
                'Scorpion': 'Mlk00',
                '.Son King': 'God19',
                'NeferpitouI': 'Ana025',
                'PNTS': 'pNtS',
                'ToxicSkull√': 'L@!on', // EQUIPE LIBERADA
                'VISITANTE': '123456',
                'TESTE': 'teste123'
            };
            
            if (adms[usuario] && adms[usuario] === senha) {
                alert('👑 ACESSO ADM CONCEDIDO!');
                window.location.href = 'painel-adm.html';
            } else {
                // MODO PÚBLICO: MESMO COM SENHA ERRADA, PERMITE ACESSO
                alert('🔓 MODO PÚBLICO: Acesso concedido como visitante');
                window.location.href = 'md1.html';
            }
        }

        // 📱 REDES SOCIAIS - ATUALIZADAS
        function abrirInstagram() {
            window.open('https://instagram.com/furiadanightplay', '_blank');
        }

        function abrirYouTube() {
            window.open('https://youtube.com/@furiadanightplay', '_blank');
        }

        function abrirTikTok() {
            window.open('https://tiktok.com/@furiadanightplay', '_blank');
        }

        function abrirWhatsApp() {
            window.open('https://wa.me/553197319008', '_blank');
        }

        // 🔄 FUNÇÕES ADICIONAIS
        function voltarInicio() {
            window.location.href = 'index.html';
        }

        // ⚡ INICIALIZAÇÃO DO SISTEMA
        document.addEventListener('DOMContentLoaded', function() {
            // Efeito de digitação no título
            const title = document.querySelector('.adm-title');
            const originalText = title.textContent;
            title.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    title.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            setTimeout(typeWriter, 500);

            // CONFIGURAÇÕES AUTOMÁTICAS
            localStorage.setItem('modoPublico', 'true');
            localStorage.setItem('acessoLivre', 'ativo');
            localStorage.setItem('loginObrigatorio', 'false');
            localStorage.setItem('sistemaAtualizado', 'true');
            
            console.log('🎯 SISTEMA 100% LIBERADO - TODOS OS ACESSOS ATIVOS');
        });

        // 📞 ENTER PARA LOGIN
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                fazerLoginAdm();
            }
        });
    </script>
</body>
</html>