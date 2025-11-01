// FUNÇÃO PARA A PÁGINA INICIAL
function inicializarPaginaInicial() {
    console.log('🏠 Página Inicial - Agente Da Noite');
    
    // Efeitos nos cards de membros
    document.querySelectorAll('.membro-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Adiciona ao carregamento da página inicial
if (window.location.href.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', inicializarPaginaInicial);
}