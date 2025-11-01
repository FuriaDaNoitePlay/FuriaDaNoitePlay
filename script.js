// Sistema de Login e Proteção de Páginas
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de troca de tipo de login
    const typeBtns = document.querySelectorAll('.type-btn');
    const loginForm = document.getElementById('loginForm');
    
    if (typeBtns.length > 0) {
        typeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                typeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Atualiza placeholder conforme o tipo
                const input = loginForm.querySelector('input[type="text"]');
                const type = this.getAttribute('data-type');
                
                if (type === 'equipe') {
                    input.placeholder = 'Nome da Equipe';
                } else if (type === 'adm') {
                    input.placeholder = 'Usuário ADM';
                } else {
                    input.placeholder = 'Digite seu Nick';
                }
            });
        });
    }
    
    // Sistema de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const typeBtn = document.querySelector('.type-btn.active');
            const type = typeBtn.getAttribute('data-type');
            const inputs = this.querySelectorAll('input');
            
            // Salva login no localStorage
            localStorage.setItem('usuarioLogado', JSON.stringify({
                tipo: type,
                nome: inputs[0].value,
                timestamp: new Date().getTime()
            }));
            
            // Redireciona conforme o tipo
            if (type === 'equipe') {
                window.location.href = 'campeonato.html';
            } else if (type === 'adm') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'membros.html';
            }
        });
    }
    
    // Verifica se está logado para acessar páginas protegidas
    verificarAcesso();
});

// Função para verificar acesso às páginas
function verificarAcesso() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const paginaAtual = window.location.pathname;
    
    // Páginas que não precisam de login
    const paginasPublicas = ['/index.html', '/login.html', '/cadastro.html', '/'];
    
    // Se não está logado e tentando acessar página protegida
    if (!usuarioLogado && !paginasPublicas.some(pagina => paginaAtual.includes(pagina))) {
        window.location.href = 'login.html';
        return;
    }
    
    // Se está logado, atualiza a navegação
    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        atualizarNavegacao(usuario);
    }
}

// Atualiza a navegação quando usuário está logado
function atualizarNavegacao(usuario) {
    const mainNav = document.querySelector('.main-nav');
    
    if (mainNav && window.location.pathname.includes('index.html')) {
        // Remove link de Login e adiciona outras abas
        const loginLink = mainNav.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.remove();
            
            // Adiciona abas conforme o tipo de usuário
            if (usuario.tipo === 'equipe') {
                mainNav.innerHTML += `
                    <a href="campeonato.html" class="nav-link neon-text">Campeonato</a>
                    <a href="chatgeral.html" class="nav-link neon-text">Chat Geral</a>
                    <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (${usuario.nome})</a>
                `;
            } else if (usuario.tipo === 'adm') {
                mainNav.innerHTML += `
                    <a href="campeonato.html" class="nav-link neon-text">Campeonato</a>
                    <a href="membros.html" class="nav-link neon-text">Membros</a>
                    <a href="admin.html" class="nav-link neon-text">Painel ADM</a>
                    <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (ADM)</a>
                `;
            } else {
                mainNav.innerHTML += `
                    <a href="membros.html" class="nav-link neon-text">Membros</a>
                    <a href="chatgeral.html" class="nav-link neon-text">Chat Geral</a>
                    <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (${usuario.nome})</a>
                `;
            }
        }
    }
}

// Função para sair
function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Verifica se está na página certa conforme o tipo de usuário
function verificarPaginaPermitida() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) return;
    
    const paginaAtual = window.location.pathname;
    
    if (usuario.tipo === 'membro' && paginaAtual.includes('admin.html')) {
        window.location.href = 'membros.html';
    }
    
    if (usuario.tipo === 'equipe' && paginaAtual.includes('membros.html')) {
        window.location.href = 'campeonato.html';
    }
}