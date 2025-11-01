// Navegação
function abrirMD(pagina) {
    window.location.href = `mente-digital/${pagina}.html`;
}

function abrirWhatsApp() {
    const numero = "553197319008";
    const mensagem = "Olá! Vim pelo site da FuriaDaNoitePlay e gostaria de mais informações!";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

function abrirLogin() {
    window.location.href = 'login.html';
}

// Sistema de Login
function fazerLogin() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    if (usuario === 'furia' && senha === 'noite2025') {
        alert('✅ Login realizado! Acessando Painel...');
        abrirMD('md3');
    } else {
        alert('❌ Usuário ou senha incorretos!');
    }
}

// Comandos do Sistema
function executarComando(comando) {
    const consoleOutput = document.getElementById('console');
    const timestamp = new Date().toLocaleTimeString();
    
    switch(comando) {
        case 'start':
            adicionarConsole(`[${timestamp}] ▶️ Servidor Furia iniciado`);
            break;
        case 'restart':
            adicionarConsole(`[${timestamp}] 🔄 Servidor reiniciado`);
            break;
        case 'stop':
            adicionarConsole(`[${timestamp}] ⏹️ Servidor parado`);
            break;
        case 'backup':
            adicionarConsole(`[${timestamp}] 💾 Backup realizado`);
            break;
        default:
            adicionarConsole(`[${timestamp}] ❓ Comando desconhecido: ${comando}`);
    }
}

function adicionarConsole(mensagem) {
    const consoleOutput = document.getElementById('console');
    if (consoleOutput) {
        const div = document.createElement('div');
        div.textContent = mensagem;
        consoleOutput.appendChild(div);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 FuriaDaNoitePlay - Sistema carregado!');
    
    // Efeito nos cards
    const cards = document.querySelectorAll('.md-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
});