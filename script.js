// ===============================================================
// SISTEMA COMPLETO FURIA DA NOITE PLAY
// ===============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Furia da Noite Play - Sistema Iniciado!');
    
    // SISTEMA DE LOGIN VISITANTE (só nick)
    const visitanteForm = document.getElementById('visitanteForm');
    if (visitanteForm) {
        visitanteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nick = this.querySelector('input').value.trim();
            
            if (nick) {
                // Salva como visitante
                localStorage.setItem('usuarioLogado', JSON.stringify({
                    tipo: 'visitante',
                    nick: nick,
                    timestamp: new Date().getTime()
                }));
                
                // Mostra mensagem de boas-vindas
                mostrarMensagemBoasVindas(nick, 'visitante');
            } else {
                alert('Por favor, digite seu nick!');
            }
        });
    }
    
    // SISTEMA DE LOGIN NORMAL (membro/equipe/adm)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Troca de tipo de login
        const typeBtns = document.querySelectorAll('.type-btn');
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
        
        // Submit do login
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input');
            const nick = inputs[0].value.trim();
            const senha = inputs[1].value.trim();
            const tipoAtivo = document.querySelector('.type-btn.active').getAttribute('data-type');
            
            if (nick && senha) {
                // Salva login
                localStorage.setItem('usuarioLogado', JSON.stringify({
                    tipo: tipoAtivo,
                    nick: nick,
                    timestamp: new Date().getTime()
                }));
                
                mostrarMensagemBoasVindas(nick, tipoAtivo);
            } else {
                alert('Por favor, preencha todos os campos!');
            }
        });
    }
    
    // SISTEMA DE CADASTRO
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input');
            const nick = inputs[0].value.trim();
            const senha = inputs[1].value.trim();
            
            if (nick && senha) {
                // Aqui você pode salvar no banco de dados
                alert('🎉 Cadastro realizado com sucesso!\n\nNick: ' + nick + '\nAgora faça login para acessar o sistema.');
                window.location.href = 'login.html';
            } else {
                alert('Por favor, preencha todos os campos!');
            }
        });
    }
    
    // VERIFICA SE USUÁRIO ESTÁ LOGADO E ATUALIZA NAVEGAÇÃO
    verificarEAtualizarNavegacao();
    
    // INICIALIZA SISTEMA DE PONTUAÇÃO SE ESTIVER NA PÁGINA DE CAMPEONATO
    if (window.location.href.includes('campeonato.html')) {
        inicializarSistemaPontos();
    }
});

// ===============================================================
// FUNÇÕES DO SISTEMA
// ===============================================================

// MOSTRA MENSAGEM DE BOAS-VINDAS
function mostrarMensagemBoasVindas(nick, tipo) {
    const mensagens = {
        'visitante': `Seja bem-vindo, ${nick}!`,
        'membro': `Bem-vindo de volta, ${nick}!`,
        'equipe': `Equipe ${nick} conectada!`,
        'adm': `Sistema ADM ativado!`
    };
    
    const modal = document.createElement('div');
    modal.className = 'welcome-message';
    modal.innerHTML = `
        <h2>🎉 ${mensagens[tipo]}</h2>
        <p>Acesso liberado ao sistema!</p>
        <button onclick="entrarNoSite()">Acessar Área</button>
    `;
    document.body.appendChild(modal);
}

// REDIRECIONA PARA A ÁREA CORRETA
function entrarNoSite() {
    // Remove a mensagem
    const modal = document.querySelector('.welcome-message');
    if (modal) modal.remove();
    
    // Redireciona conforme o tipo de usuário
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (usuario) {
        switch(usuario.tipo) {
            case 'visitante':
                window.location.href = 'area-visitante.html';
                break;
            case 'membro':
                window.location.href = 'area-membro.html';
                break;
            case 'equipe':
                window.location.href = 'campeonato.html';
                break;
            case 'adm':
                window.location.href = 'admin.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }
}

// VERIFICA LOGIN E ATUALIZA NAVEGAÇÃO
function verificarEAtualizarNavegacao() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const paginaAtual = window.location.pathname;
    
    // Lista de páginas públicas (não precisam de login)
    const paginasPublicas = ['/index.html', '/login.html', '/cadastro.html', '/'];
    
    // Se não está logado e tentando acessar página protegida
    if (!usuario && !paginasPublicas.some(pagina => paginaAtual.includes(pagina))) {
        window.location.href = 'login.html';
        return;
    }
    
    // Se está logado, atualiza a interface
    if (usuario) {
        atualizarInterfaceUsuario(usuario);
        
        // Verifica se o usuário está na página correta
        verificarPaginaPermitida(usuario);
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
            
            // Adiciona abas conforme o tipo de usuário
            let abas = '';
            
            switch(usuario.tipo) {
                case 'visitante':
                    abas = `
                        <a href="campeonato.html" class="nav-link neon-text">Campeonato</a>
                        <a href="regras.html" class="nav-link neon-text">Regras</a>
                        <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (${usuario.nick})</a>
                    `;
                    break;
                case 'membro':
                    abas = `
                        <a href="membros.html" class="nav-link neon-text">Membros</a>
                        <a href="campeonato.html" class="nav-link neon-text">Campeonato</a>
                        <a href="chatgeral.html" class="nav-link neon-text">Chat Geral</a>
                        <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (${usuario.nick})</a>
                    `;
                    break;
                case 'equipe':
                    abas = `
                        <a href="campeonato.html" class="nav-link neon-text">Campeonato</a>
                        <a href="chatgeral.html" class="nav-link neon-text">Chat Geral</a>
                        <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (${usuario.nick})</a>
                    `;
                    break;
                case 'adm':
                    abas = `
                        <a href="campeonato.html" class="nav-link neon-text">Campeonato</a>
                        <a href="membros.html" class="nav-link neon-text">Membros</a>
                        <a href="admin.html" class="nav-link neon-text">Painel ADM</a>
                        <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (ADM)</a>
                    `;
                    break;
            }
            
            mainNav.innerHTML += abas;
        }
    }
    
    // Atualiza título da página se for visitante
    if (usuario.tipo === 'visitante' && document.querySelector('.user-type .type-label')) {
        document.querySelector('.user-type .type-label').textContent = 'Visitante Logado';
    }
}

// VERIFICA SE O USUÁRIO ESTÁ NA PÁGINA PERMITIDA
function verificarPaginaPermitida(usuario) {
    const paginaAtual = window.location.pathname;
    
    // Restrições de acesso
    if (usuario.tipo === 'visitante') {
        const paginasProibidas = ['membros.html', 'admin.html', 'chatgeral.html'];
        if (paginasProibidas.some(pagina => paginaAtual.includes(pagina))) {
            window.location.href = 'area-visitante.html';
        }
    }
    
    if (usuario.tipo === 'membro' && paginaAtual.includes('admin.html')) {
        window.location.href = 'membros.html';
    }
}

// SISTEMA DE PONTUAÇÃO PARA CAMPEONATO
function inicializarSistemaPontos() {
    const linhasTabela = document.querySelectorAll('.tabela-classificacao tbody tr');
    
    linhasTabela.forEach(linha => {
        const vitorias = parseInt(linha.cells[4].textContent) || 0;
        const empates = parseInt(linha.cells[5].textContent) || 0;
        const derrotas = parseInt(linha.cells[6].textContent) || 0;
        
        // Calcula pontos: Vitória=4, Empate=1, Derrota=-1
        const pontos = (vitorias * 4) + (empates * 1) + (derrotas * -1);
        linha.cells[7].textContent = pontos;
        
        // Atualiza cores conforme a posição
        atualizarCoresPosicao(linha);
    });
}

// ATUALIZA CORES DAS POSIÇÕES NA TABELA
function atualizarCoresPosicao(linha) {
    const posicao = parseInt(linha.cells[0].textContent);
    
    linha.className = ''; // Remove classes anteriores
    
    if (posicao === 1) {
        linha.classList.add('primeiro-lugar');
    } else if (posicao === 2) {
        linha.classList.add('segundo-lugar');
    } else if (posicao === 3) {
        linha.classList.add('terceiro-lugar');
    }
}

// FUNÇÃO PARA SAIR DO SISTEMA
function sair() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    }
}

// VERIFICA SE AS PÁGINAS EXISTEM (para debug)
function verificarPaginas() {
    const paginas = [
        'index.html', 'login.html', 'cadastro.html', 
        'campeonato.html', 'membros.html', 'chatgeral.html',
        'area-visitante.html', 'area-membro.html', 'admin.html'
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

// INICIALIZA EFEITOS VISUAIS
function inicializarEfeitosNeon() {
    // Efeito hover nos botões
    document.querySelectorAll('.btn-neon, .nav-link').forEach(elemento => {
        elemento.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        elemento.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// CHAMA FUNÇÕES DE INICIALIZAÇÃO
setTimeout(() => {
    inicializarEfeitosNeon();
    
    // Para debug: descomente a linha abaixo para verificar páginas
    // verificarPaginas();
}, 1000);

// ===============================================================
// SISTEMA DE HIERARQUIA
// ===============================================================

const HIERARQUIA = {
    'dono': { nivel: 5, nome: 'Dono', cor: '#ff0000' },
    'lider': { nivel: 4, nome: 'Líder', cor: '#ff4500' },
    'colider': { nivel: 3, nome: 'Colíder', cor: '#ffa500' },
    'veterano': { nivel: 2, nome: 'Veterano', cor: '#ffff00' },
    'anciao': { nivel: 1, nome: 'Ancião', cor: '#00ff00' }
};

function getBadgeHierarquia(nivel) {
    const hierarquia = Object.values(HIERARQUIA).find(h => h.nivel === nivel);
    if (!hierarquia) return '';
    
    return `<span class="badge-hierarquia" style="background: ${hierarquia.cor}; color: #000; padding: 5px 10px; border-radius: 15px; font-weight: bold;">${hierarquia.nome}</span>`;
}

console.log('🚀 Sistema Furia da Noite Play carregado com sucesso!');
// ===============================================================
// FUNÇÕES PARA AS NOVAS PÁGINAS
// ===============================================================

// VERIFICA SE TODAS AS PÁGINAS EXISTEM
function verificarTodasPaginas() {
    const paginas = [
        'index.html',
        'login.html', 
        'cadastro.html',
        'campeonato.html',
        'area-visitante.html',
        'regras.html',
        'membros.html',
        'chatgeral.html',
        'admin.html'
    ];
    
    console.log('🔍 Verificando integridade do site...');
    
    paginas.forEach(pagina => {
        fetch(pagina)
            .then(response => {
                if (response.ok) {
                    console.log(`✅ ${pagina} - OK`);
                } else {
                    console.log(`❌ ${pagina} - 404 (Precisa criar)`);
                }
            })
            .catch(error => {
                console.log(`❌ ${pagina} - Erro: ${error}`);
            });
    });
}

// REDIRECIONAMENTO INTELIGENTE APÓS LOGIN
function redirecionarAposLogin(usuario) {
    switch(usuario.tipo) {
        case 'visitante':
            window.location.href = 'area-visitante.html';
            break;
        case 'membro':
            window.location.href = 'membros.html';
            break;
        case 'equipe':
            window.location.href = 'campeonato.html';
            break;
        case 'adm':
            window.location.href = 'admin.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// ATUALIZAR HEADER EM TODAS AS PÁGINAS
function atualizarHeaderGlobal() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const header = document.querySelector('header');
    
    if (header && usuario) {
        const nav = header.querySelector('.main-nav');
        if (nav) {
            // Mantém apenas links básicos e adiciona sair
            nav.innerHTML = `
                <a href="index.html" class="nav-link neon-text">Início</a>
                <a href="campeonato.html" class="nav-link neon-text">Campeonato</a>
                <a href="regras.html" class="nav-link neon-text">Regras</a>
                <a href="#" class="nav-link neon-btn" onclick="sair()">Sair (${usuario.nick})</a>
            `;
        }
    }
}

// INICIALIZAR SISTEMA COMPLETO
function inicializarSistemaCompleto() {
    console.log('🎮 Sistema Furia da Noite - Inicializado!');
    
    // Verifica login
    verificarEAtualizarNavegacao();
    
    // Atualiza header se estiver logado
    atualizarHeaderGlobal();
    
    // Inicializa sistema de pontos se na página de campeonato
    if (window.location.href.includes('campeonato.html')) {
        inicializarSistemaPontos();
    }
    
    // Para debug (descomente se quiser testar)
    // verificarTodasPaginas();
}

// EXECUTAR QUANDO A PÁGINA CARREGAR
document.addEventListener('DOMContentLoaded', inicializarSistemaCompleto);
// FUNÇÃO PARA A PÁGINA FRØN
function inicializarFron() {
    console.log('🌕 Página FRØN inicializada');
    
    // Adiciona efeitos especiais nos botões
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Efeito visual ao clicar
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Adiciona ao carregamento da página
if (window.location.href.includes('fron.html')) {
    document.addEventListener('DOMContentLoaded', inicializarFron);
}