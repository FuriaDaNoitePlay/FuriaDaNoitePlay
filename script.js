// ===============================================================
// SISTEMA FURIA DA NOITE PLAY - JAVASCRIPT
// ===============================================================

// SISTEMA DE LOGIN DINÂMICO
document.addEventListener('DOMContentLoaded', function() {
    // Troca de formulários de login
    const loginOptions = document.querySelectorAll('.login-option');
    const loginForms = document.querySelectorAll('.login-form');
    
    if (loginOptions.length > 0) {
        loginOptions.forEach(option => {
            option.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                
                // Remove active de todos
                loginOptions.forEach(opt => opt.classList.remove('active'));
                loginForms.forEach(form => form.classList.remove('active'));
                
                // Adiciona active no selecionado
                this.classList.add('active');
                document.getElementById(`form-${type}`).classList.add('active');
            });
        });
    }
    
    // SISTEMA DE CADASTRO DINÂMICO
    const cadastroOptions = document.querySelectorAll('.cadastro-option');
    const cadastroForms = document.querySelectorAll('.cadastro-form');
    
    if (cadastroOptions.length > 0) {
        cadastroOptions.forEach(option => {
            option.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                
                // Remove active de todos
                cadastroOptions.forEach(opt => opt.classList.remove('active'));
                cadastroForms.forEach(form => form.classList.remove('active'));
                
                // Adiciona active no selecionado
                this.classList.add('active');
                document.getElementById(`cadastro-${type}`).classList.add('active');
                
                // Se for equipe, inicializa jogadores
                if (type === 'equipe') {
                    inicializarJogadores();
                }
            });
        });
    }
    
    // SISTEMA DE PONTUAÇÃO
    inicializarSistemaPontos();
    
    // VERIFICA SE USUÁRIO ESTÁ LOGADO
    verificarLogin();
});

// SISTEMA DE JOGADORES PARA CADASTRO DE EQUIPE
function inicializarJogadores() {
    const container = document.getElementById('jogadores-lista');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-neon';
        input.placeholder = `Jogador ${i}`;
        input.required = true;
        container.appendChild(input);
    }
}

function adicionarJogador() {
    const container = document.getElementById('jogadores-lista');
    const inputs = container.getElementsByTagName('input');
    
    if (inputs.length < 10) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-neon';
        input.placeholder = `Jogador ${inputs.length + 1}`;
        input.required = true;
        container.appendChild(input);
    } else {
        alert('Máximo de 10 jogadores por equipe!');
    }
}

// SISTEMA DE PONTUAÇÃO
function inicializarSistemaPontos() {
    // Sistema de cálculo automático de pontos
    const linhasTabela = document.querySelectorAll('.tabela-classificacao tbody tr');
    
    linhasTabela.forEach(linha => {
        const vitorias = parseInt(linha.cells[4].textContent) || 0;
        const empates = parseInt(linha.cells[5].textContent) || 0;
        const derrotas = parseInt(linha.cells[6].textContent) || 0;
        
        // Calcula pontos: Vitória=4, Empate=1, Derrota=-1
        const pontos = (vitorias * 4) + (empates * 1) + (derrotas * -1);
        linha.cells[7].textContent = pontos;
    });
}

// SISTEMA DE LOGIN
function fazerLogin(tipo, dados) {
    // Simulação de login - depois integrar com backend
    localStorage.setItem('usuarioLogado', JSON.stringify({
        tipo: tipo,
        nome: dados.nome,
        timestamp: new Date().getTime()
    }));
    
    // Redireciona conforme o tipo
    switch(tipo) {
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

function verificarLogin() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (usuario) {
        // Atualiza interface para usuário logado
        const navLinks = document.querySelector('.main-nav');
        if (navLinks) {
            const loginLink = navLinks.querySelector('a[href="login.html"]');
            if (loginLink) {
                loginLink.textContent = `👋 ${usuario.nome}`;
                loginLink.href = '#';
            }
        }
    }
}

// SISTEMA DE HIERARQUIA
const HIERARQUIA = {
    'dono': { nivel: 5, cor: '#ff0000', nome: 'Dono' },
    'lider': { nivel: 4, cor: '#ff4500', nome: 'Líder' },
    'colider': { nivel: 3, cor: '#ffa500', nome: 'Colíder' },
    'veterano': { nivel: 2, cor: '#ffff00', nome: 'Veterano' },
    'ancião': { nivel: 1, cor: '#00ff00', nome: 'Ancião' }
};

function getHierarquia(nivel) {
    return Object.values(HIERARQUIA).find(h => h.nivel === nivel) || HIERARQUIA['ancião'];
}

// ANIMAÇÕES NEON
function ativarEfeitoNeon(elemento) {
    elemento.style.boxShadow = '0 0 20px var(--neon-red), 0 0 40px var(--neon-red)';
    setTimeout(() => {
        elemento.style.boxShadow = '';
    }, 500);
}

// EVENT LISTENERS PARA FORMULÁRIOS
document.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (e.target.matches('.login-form')) {
        const tipo = e.target.id.replace('form-', '');
        const inputs = e.target.querySelectorAll('input');
        const dados = {};
        
        inputs.forEach(input => {
            dados[input.placeholder.toLowerCase()] = input.value;
        });
        
        fazerLogin(tipo, dados);
    }
    
    if (e.target.matches('.cadastro-form')) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
    }
});

// CONTAGEM REGRESSIVA PARA CONFRONTOS
function iniciarContagemRegressiva() {
    const elementosContagem = document.querySelectorAll('.contagem-regressiva');
    
    elementosContagem.forEach(elemento => {
        const dataAlvo = new Date(elemento.getAttribute('data-alvo')).getTime();
        
        setInterval(() => {
            const agora = new Date().getTime();
            const diferenca = dataAlvo - agora;
            
            if (diferenca > 0) {
                const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
                const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
                
                elemento.textContent = `${dias}d ${horas}h ${minutos}m`;
            } else {
                elemento.textContent = 'AO VIVO!';
                elemento.style.color = 'var(--neon-green)';
            }
        }, 1000);
    });
}

// INICIALIZA TODOS OS SISTEMAS
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Furia da Noite Play - Sistema Iniciado!');
    
    // Efeitos visuais
    document.querySelectorAll('.btn-neon').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            ativarEfeitoNeon(this);
        });
    });
});