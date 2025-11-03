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
            --adm-azul: #00ffff;
            --fundo-escuro: #0a0a0a;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #1a0a0a, #0a0a0a, #001a0a);
            color: var(--adm-amarelo);
            font-family: 'Courier New', monospace;
            min-height: 100vh;
            padding: 20px;
            overflow-x: hidden;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        /* HEADER ADM - EFEITO 3D */
        .adm-header {
            text-align: center;
            padding: 40px 30px;
            margin-bottom: 40px;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 20px;
            border: 4px solid var(--adm-verde);
            box-shadow: 
                0 0 30px var(--adm-verde),
                inset 0 0 20px rgba(0, 255, 0, 0.1);
            position: relative;
            overflow: hidden;
            animation: pulse-header 3s infinite alternate;
        }

        @keyframes pulse-header {
            0% { 
                box-shadow: 0 0 20px var(--adm-verde),
                           inset 0 0 15px rgba(0, 255, 0, 0.1);
            }
            100% { 
                box-shadow: 0 0 40px var(--adm-verde),
                           0 0 60px rgba(0, 255, 0, 0.3),
                           inset 0 0 25px rgba(0, 255, 0, 0.2);
            }
        }

        .adm-header::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 0, 0.1), transparent);
            animation: brilho-adm 8s linear infinite;
            z-index: 1;
        }

        @keyframes brilho-adm {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .adm-title {
            font-size: 3rem;
            color: var(--adm-verde);
            text-shadow: 
                0 0 20px var(--adm-verde),
                0 0 40px var(--adm-verde),
                0 0 60px var(--adm-verde);
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
            animation: title-glow 2s ease-in-out infinite alternate;
        }

        @keyframes title-glow {
            0% { text-shadow: 0 0 20px var(--adm-verde); }
            100% { text-shadow: 0 0 30px var(--adm-verde), 0 0 50px var(--adm-verde); }
        }

        .adm-subtitle {
            color: var(--adm-verde);
            text-shadow: 0 0 15px var(--adm-verde);
            font-size: 1.3rem;
            position: relative;
            z-index: 2;
        }

        /* STATUS DO SISTEMA - GRADE MODERNA */
        .status-sistema {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .status-item {
            background: linear-gradient(145deg, #0a0a0a, #1a1a1a);
            padding: 25px 15px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid var(--adm-verde);
            box-shadow: 
                0 5px 15px rgba(0, 255, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .status-item:hover {
            transform: translateY(-5px);
            box-shadow: 
                0 10px 25px rgba(0, 255, 0, 0.5),
                0 0 30px rgba(0, 255, 0, 0.2);
        }

        .status-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.1), transparent);
            transition: left 0.6s;
        }

        .status-item:hover::before {
            left: 100%;
        }

        .status-indicator {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            margin: 0 auto 15px;
            background: var(--adm-verde);
            box-shadow: 
                0 0 15px var(--adm-verde),
                inset 0 0 10px rgba(255, 255, 255, 0.3);
            animation: pulse-indicator 2s infinite;
        }

        @keyframes pulse-indicator {
            0%, 100% { 
                box-shadow: 0 0 15px var(--adm-verde),
                           inset 0 0 10px rgba(255, 255, 255, 0.3);
            }
            50% { 
                box-shadow: 0 0 25px var(--adm-verde),
                           0 0 35px rgba(0, 255, 0, 0.5),
                           inset 0 0 15px rgba(255, 255, 255, 0.5);
            }
        }

        /* ACESSO LIVRE - DESTAQUE */
        .acesso-livre {
            background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05));
            border: 3px solid var(--adm-verde);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            box-shadow: 
                0 0 30px rgba(0, 255, 0, 0.4),
                inset 0 0 20px rgba(0, 255, 0, 0.1);
            position: relative;
            overflow: hidden;
        }

        .acesso-livre::before {
            content: '⚡';
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 2rem;
            opacity: 0.3;
        }

        /* BOTÕES - DESIGN PREMIUM */
        .btn-adm {
            padding: 20px 35px;
            border: none;
            border-radius: 30px;
            font-weight: bold;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            font-family: 'Courier New', monospace;
            background: linear-gradient(145deg, var(--adm-verde), #00cc00);
            color: #000;
            box-shadow: 
                0 5px 20px rgba(0, 255, 0, 0.4),
                0 0 30px rgba(0, 255, 0, 0.2);
            margin: 12px;
            width: 90%;
            position: relative;
            overflow: hidden;
        }

        .btn-adm::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: left 0.6s;
        }

        .btn-adm:hover::before {
            left: 100%;
        }

        .btn-adm:hover {
            transform: 
                translateY(-3px) 
                scale(1.05);
            box-shadow: 
                0 8px 30px rgba(0, 255, 0, 0.6),
                0 0 40px rgba(0, 255, 0, 0.3);
        }

        .btn-adm:active {
            transform: translateY(1px);
        }

        .btn-modo {
            background: linear-gradient(145deg, #ff0000, #ffff00);
            box-shadow: 
                0 5px 20px rgba(255, 255, 0, 0.4),
                0 0 30px rgba(255, 255, 0, 0.2);
        }

        .btn-modo:hover {
            box-shadow: 
                0 8px 30px rgba(255, 255, 0, 0.6),
                0 0 40px rgba(255, 255, 0, 0.3);
        }

        .btn-redes {
            background: linear-gradient(145deg, #ff0000, #ff00ff);
            padding: 15px 25px;
            font-size: 1.1rem;
            width: auto;
            min-width: 160px;
            margin: 8px;
        }

        /* LOGIN CONTAINER - EFEITO GLASS */
        .login-container {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.9));
            padding: 40px;
            border-radius: 20px;
            border: 3px solid var(--adm-verde);
            box-shadow: 
                0 0 35px rgba(0, 255, 0, 0.5),
                inset 0 0 20px rgba(0, 255, 0, 0.1);
            margin-bottom: 40px;
            backdrop-filter: blur(10px);
            position: relative;
        }

        .login-container::after {
            content: '🔐';
            position: absolute;
            top: 20px;
            right: 25px;
            font-size: 1.8rem;
            opacity: 0.5;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 25px;
        }

        .input-group label {
            color: var(--adm-verde);
            font-weight: bold;
            text-shadow: 0 0 10px var(--adm-verde);
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .input-group input {
            padding: 18px 20px;
            border: 2px solid var(--adm-verde);
            border-radius: 12px;
            background: rgba(0, 255, 0, 0.05);
            color: white;
            font-size: 1.1rem;
            font-family: 'Courier New', monospace;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .input-group input:focus {
            outline: none;
            border-color: var(--adm-azul);
            box-shadow: 
                inset 0 2px 10px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(0, 255, 255, 0.4);
            background: rgba(0, 255, 0, 0.1);
        }

        /* GRUPO DE BOTÕES REDES */
        .redes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        /* RESPONSIVIDADE AVANÇADA */
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
            
            .status-sistema {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .adm-title {
                font-size: 2.2rem;
            }
            
            .login-container {
                padding: 25px;
            }
            
            .btn-adm {
                padding: 18px 25px;
                font-size: 1.1rem;
            }
            
            .redes-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .adm-title {
                font-size: 1.8rem;
            }
            
            .adm-subtitle {
                font-size: 1.1rem;
            }
            
            .acesso-livre,
            .login-container {
                padding: 20px;
            }
        }

        /* EFEITO DE DIGITAÇÃO */
        .typing-effect {
            overflow: hidden;
            border-right: 3px solid var(--adm-verde);
            white-space: nowrap;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }

        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }

        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: var(--adm-verde) }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER ADM -->
        <header class="adm-header">
            <h1 class="adm-title typing-effect">👑 SISTEMA 100% LIBERADO</h1>
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
            <div class="status-item">
                <div class="status-indicator"></div>
                <div>⚡ PERFORMANCE</div>
                <small>MAXIMIZADA</small>
            </div>
        </div>

        <!-- ACESSO LIVRE -->
        <div class="acesso-livre">
            <h3>🎯 ACESSO IMEDIATO - SEM LOGIN</h3>
            <button class="btn-adm" onclick="acessoDireto()">
                🎮 ENTRAR DIRETO NO JOGO
            </button>
            <p style="margin-top: 15px; color: var(--adm-verde); font-size: 0.9em;">
                ⚡ Modo Público Ativo - Todos os recursos liberados
            </p>
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
            <button class="btn-adm btn-modo" onclick="abrirMD('md4')">
                🌙 MODO NOTURNO
            </button>
        </div>

        <!-- LOGIN ADM (OPCIONAL) -->
        <div class="login-container">
            <h3 style="text-align: center; color: var(--adm-verde); margin-bottom: 25px;">
                🔑 LOGIN ADM (OPCIONAL)
            </h3>
            <div class="input-group">
                <label>👑 USUÁRIO:</label>
                <input type="text" id="usuarioAdm" value="FURIAGOD" placeholder="Digite seu usuário ADM">
            </div>
            <div class="input-group">
                <label>🔒 SENHA:</label>
                <input type="password" id="senhaAdm" value="Furia2025_$" placeholder="Digite sua senha">
            </div>
            <button class="btn-adm" onclick="fazerLoginAdm()">
                🚀 ACESSAR PAINEL ADM COMPLETO
            </button>
        </div>

        <!-- REDES SOCIAIS -->
        <div class="acesso-livre">
            <h3>📱 REDES OFICIAIS</h3>
            <div class="redes-grid">
                <button class="btn-adm btn-redes" onclick="abrirInstagram()">
                    📸 Instagram
                </button>
                <button class="btn-adm btn-redes" onclick="abrirYouTube()">
                    🎥 YouTube
                </button>
                <button class="btn-adm btn-redes" onclick="abrirTikTok()">
                    🎵 TikTok
                </button>
                <button class="btn-adm btn-redes" onclick="abrirWhatsApp()">
                    💬 WhatsApp
                </button>
                <button class="btn-adm btn-redes" onclick="abrirDiscord()">
                    🎮 Discord
                </button>
            </div>
        </div>
    </div>

    <script>
        // =============================================
        // SISTEMA ADM SUPREMO - ATUALIZADO
        // =============================================

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

        // 🕹️ FUNÇÕES DE NAVEGAÇÃO - EXPANDIDAS
        function abrirMD(md) {
            const pages = {
                'md1': 'trucu-paulista.html',
                'md2': 'modo-furia.html', 
                'md3': 'modo-equipe.html',
                'md4': 'modo-noturno.html'
            };
            
            if (pages[md]) {
                window.location.href = pages[md];
            } else {
                window.location.href = 'md1.html';
            }
        }

        // 🔑 SISTEMA DE LOGIN - MELHORADO
        function fazerLoginAdm() {
            const usuario = document.getElementById('usuarioAdm').value.trim();
            const senha = document.getElementById('senhaAdm').value;
            
            // CREDENCIAIS ADM EXPANDIDAS
            const adms = {
                'FURIAGOD': 'Furia2025_$',
                'Scorpion': 'Mlk00',
                '.Son King': 'God19',
                'NeferpitouI': 'Ana025',
                'PNTS': 'pNtS',
                'ToxicSkull√': 'L@!on',
                'ADMIN': 'admin123',
                'MODERADOR': 'mod123',
                'VISITANTE': '123456',
                'TESTE': 'teste123',
                'FURIA': 'furia2024',
                'ROOT': 'rootAccess'
            };
            
            const loginBtn = document.querySelector('.login-container .btn-adm');
            
            if (adms[usuario] && adms[usuario] === senha) {
                loginBtn.innerHTML = '✅ ACESSO CONCEDIDO...';
                loginBtn.style.background = 'linear-gradient(145deg, #00ff00, #00cc00)';
                
                setTimeout(() => {
                    alert(`👑 BEM-VINDO, ${usuario}! Acesso ADM concedido.`);
                    window.location.href = 'painel-adm-completo.html';
                }, 1000);
            } else {
                loginBtn.innerHTML = '❌ ACESSO NEGADO';
                loginBtn.style.background = 'linear-gradient(145deg, #ff0000, #cc0000)';
                
                setTimeout(() => {
                    loginBtn.innerHTML = '🚀 ACESSAR PAINEL ADM COMPLETO';
                    loginBtn.style.background = 'linear-gradient(145deg, var(--adm-verde), #00cc00)';
                    alert('🔓 MODO PÚBLICO: Acesso concedido como visitante');
                    window.location.href = 'md1.html';
                }, 1500);
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

        function abrirDiscord() {
            window.open('https://discord.gg/furiadanightplay', '_blank');
        }

        // ⚡ INICIALIZAÇÃO DO SISTEMA
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎯 SISTEMA ADM SUPREMO INICIADO - TODOS OS RECURSOS ATIVOS');
            
            // Configurações automáticas
            const configs = {
                'modoPublico': 'true',
                'acessoLivre': 'ativo', 
                'loginObrigatorio': 'false',
                'sistemaAtualizado': 'true',
                'performanceMax': 'ativada',
                'seguranca': 'mo