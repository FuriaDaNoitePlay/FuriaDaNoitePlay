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
    const senha = document.getElementById('senhaAdm').value.trim();
    
    // Credenciais dos ADMs
    const admCredentials = {
        'FURIAGOD': 'Furia2025_$',
        'Scorpion': 'Mlk00',
        '.Son King': 'God19',
        'NeferpitouI': 'Ana025',
        'PNTS': 'pNtS',
        'ToxicSkull√': 'L@!on',
        'Superman': 'super123'
    };

    if (admCredentials[usuario] && admCredentials[usuario] === senha) {
        // Efeito visual de sucesso
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%);
            animation: fadeOut 1.5s forwards;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(effect);
        
        // Feedback e redirecionamento
        setTimeout(() => {
            alert(`👑 BEM-VINDO, ${usuario}! Acessando Painel ADM...`);
            window.location.href = 'painel-adm.html?user=' + encodeURIComponent(usuario);
        }, 1000);
    } else {
        // Efeito visual de erro
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%);
            animation: fadeOut 1s forwards;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(effect);
        
        alert('❌ ACESSO NEGADO! Verifique usuário e senha.');
    }
}

// ===== PLAYER DE MÚSICA =====
const musica = document.getElementById('musica');
const btnPlay = document.getElementById('btnPlay');
let musicaTocando = false;

function toggleMusica() {
    if (!musicaTocando) {
        musica.play();
        musicaTocando = true;
        btnPlay.innerHTML = '<i class="fas fa-pause"></i>';
        btnPlay.style.background = 'linear-gradient(135deg, #ff0000, #cc0000)';
    } else {
        musica.pause();
        musicaTocando = false;
        btnPlay.innerHTML = '<i class="fas fa-play"></i>';
        btnPlay.style.background = 'linear-gradient(135deg, var(--vermelho-furia), var(--vermelho-escuro))';
    }
}

function stopMusica() {
    musica.pause();
    musica.currentTime = 0;
    musicaTocando = false;
    btnPlay.innerHTML = '<i class="fas fa-play"></i>';
    btnPlay.style.background = 'linear-gradient(135deg, var(--vermelho-furia), var(--vermelho-escuro))';
}

// ===== EFEITOS ESPECIAIS =====
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de digitação no título
    const titulo = document.querySelector('.titulo');
    const textoOriginal = titulo.textContent;
    titulo.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < textoOriginal.length) {
            titulo.textContent += textoOriginal.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    setTimeout(typeWriter, 1000);

    // Efeito de particles no background
    criarParticles();
});

function criarParticles() {
    const colors = ['#ff0000', '#8a2be2', '#0000ff', '#00ff00'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: float ${Math.random() * 10 + 5}s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        document.body.appendChild(particle);
    }
}

// Adicionar keyframes para animação das particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(calc(-50vw + 100px));
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== BOTÃO ENTER COM TECLA =====
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fazerLoginAdm();
    }
});

// ===== CONTADOR DE VISITAS =====
let visitas = localStorage.getItem('visitasFuria') || 0;
visitas++;
localStorage.setItem('visitasFuria', visitas);
console.log(`🔥 FuriaDaNoitePlay - Visitantes: ${visitas}`);