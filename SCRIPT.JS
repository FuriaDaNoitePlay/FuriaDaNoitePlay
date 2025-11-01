// ===============================================================
// SISTEMA COMPLETO AGENTE DA NOITE
// ===============================================================

// VERIFICAÇÃO DE LOGIN EM TODAS AS PÁGINAS
function verificarLogin() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const paginaAtual = window.location.pathname;
    
    // Páginas que não precisam de login
    const paginasPublicas = ['/index.html', '/login.html', '/cadastro.html', '/'];
    
    // Se não está logado e tentando acessar página protegida
    if (!usuario && !paginasPublicas.some(pagina => paginaAtual.includes(pagina))) {
        window.location.href = 'login.html';
        return;
    }
    
    // Se está logado, atualiza a interface
    if (usuario) {
        atualizarInterfaceUsuario(usuario);
    }
}

// ATUALIZA A INTERFACE CONFORME O USUÁRIO LOGADO
function atualizarInterfaceUsuario(usuario) {
    const mainNav = document.querySelector('.main-nav');
    
    if (mainNav) {
        // Remove link de Login se existir
        const loginLink = mainNav.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.remove();
            
            // Adiciona botão de sair
            const sairBtn = document.createElement('a');
            sairBtn.href = '#';
            sairBtn.className = 'nav-link neon-btn';
            sairBtn.textContent = `Sair (${usuario.nick})`;
            sairBtn.onclick = sair;
            mainNav.appendChild(sairBtn);
        }
    }
}

// FUNÇÃO PARA SAIR
function sair() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    }
}

// INICIALIZAÇÃO DO SISTEMA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Agente Da Noite - Sistema Iniciado!');
    verificarLogin();
});

// SISTEMA DE PONTUAÇÃO PARA CAMPEONATO
function calcularPontuacao() {
    const linhas = document.querySelectorAll('.linha-tabela');
    linhas.forEach(linha => {
        // Sistema de cálculo de pontos pode ser adicionado aqui
        console.log('Calculando pontos para:', linha);
    });
}

// VERIFICA SE AS PÁGINAS EXISTEM (para debug)
function verificarPaginas() {
    const paginas = [
        'index.html', 'login.html', 'cadastro.html', 
        'campeonato.html', 'fron.html', 'regras.html',
        'area-visitante.html', 'membros.html'
    ];
    
    console.log('🔍 Verificando páginas...');
    
    paginas.forEach(pagina => {
        fetch(pagina)
            .then(response => {
                if (response.ok) {
                    console.log(`✅ ${pagina} - OK`);
                } else {
                    console.log(`❌ ${pagina} - 404 Não encontrada`);
                }
            })
            .catch(error => {
                console.log(`❌ ${pagina} - Erro: ${error}`);
            });
    });
}

// EXECUTA VERIFICAÇÃO (descomente se quiser testar)
// verificarPaginas();