// Funções de Navegação
function abrirMD(md) {
    if (md === 'md1') {
        window.location.href = 'md1.html';
    } else if (md === 'md2') {
        window.location.href = 'md2.html';
    } else if (md === 'md3') {
        window.location.href = 'login.html';
    }
}

function abrirLoginAdm() {
    window.location.href = 'login-adm.html';
}

function abrirLoginEquipe() {
    window.location.href = 'login.html';
}

function abrirCadastroMembro() {
    window.location.href = 'cadastro-membro.html';
}

function abrirCadastroEquipe() {
    window.location.href = 'cadastro-equipe.html';
}

// Redes Sociais
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

// Efeitos de Neon Dinâmico
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de digitação no subtítulo
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 1000);
    }
    
    // Efeito de pulsação nos cards
    const cards = document.querySelectorAll('.md-card, .acesso-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
});

// Sistema de Login
function fazerLogin(tipo) {
    if (tipo === 'equipe') {
        const usuario = document.getElementById('usuario')?.value;
        const senha = document.getElementById('senha')?.value;
        
        if (usuario === 'ToxicSkull√' && senha === 'L@!on') {
            alert('✅ Login realizado! Acessando Painel...');
            window.location.href = 'md3.html';
        } else {
            alert('❌ Usuário ou senha incorretos!');
        }
    }
}

function voltarInicio() {
    window.location.href = 'index.html';
}