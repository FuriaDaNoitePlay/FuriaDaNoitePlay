// Sistema de Login Fúria da Noite
document.addEventListener('DOMContentLoaded', function() {
    
    // LOGIN VISITANTE (só nick)
    const visitanteForm = document.getElementById('visitanteForm');
    if (visitanteForm) {
        visitanteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nick = this.querySelector('input').value;
            
            if (nick.trim()) {
                // Salva como visitante
                localStorage.setItem('usuario', JSON.stringify({
                    tipo: 'visitante',
                    nick: nick,
                    acesso: true
                }));
                
                // Mostra mensagem de boas-vindas
                mostrarMensagem(`Seja bem-vindo, ${nick}!`);
            }
        });
    }
    
    // LOGIN NORMAL (com senha)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input');
            const nick = inputs[0].value;
            const senha = inputs[1].value;
            
            if (nick.trim() && senha.trim()) {
                localStorage.setItem('usuario', JSON.stringify({
                    tipo: 'membro',
                    nick: nick,
                    acesso: true
                }));
                
                mostrarMensagem(`Bem-vindo de volta, ${nick}!`);
            }
        });
    }
    
    // CADASTRO
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input');
            const nick = inputs[0].value;
            const senha = inputs[1].value;
            
            if (nick.trim() && senha.trim()) {
                // Aqui você pode salvar no banco de dados
                alert('Cadastro realizado com sucesso!');
                window.location.href = 'login.html';
            }
        });
    }
    
    // Verifica se já está logado
    verificarLogin();
});

function mostrarMensagem(mensagem) {
    const modal = document.createElement('div');
    modal.className = 'welcome-message';
    modal.innerHTML = `
        <h2>🎉 ${mensagem}</h2>
        <p>Acesso liberado ao site!</p>
        <button onclick="entrarNoSite()">Acessar Site</button>
    `;
    document.body.appendChild(modal);
}

function entrarNoSite() {
    // Remove a mensagem
    document.querySelector('.welcome-message').remove();
    
    // Redireciona para a área logada
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (usuario.tipo === 'visitante') {
        window.location.href = 'area-visitante.html';
    } else {
        window.location.href = 'area-membro.html';
    }
}

function verificarLogin() {
    const usuario = localStorage.getItem('usuario');
    
    // Se já está logado, redireciona direto
    if (usuario && !window.location.href.includes('index.html') && !window.location.href.includes('login.html')) {
        const userData = JSON.parse(usuario);
        if (userData.tipo === 'visitante') {
            window.location.href = 'area-visitante.html';
        } else {
            window.location.href = 'area-membro.html';
        }
    }
}

// Função para sair
function sair() {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
}