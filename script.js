<script>
    // =============================================
    // SISTEMA COMPLETO - FRØN + ADM SUPREMO
    // =============================================

    // Efeito de interação com os checkboxes
    document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
      checkbox.addEventListener('click', function() {
        this.classList.toggle('checked');
      });
    });
    
    // Efeito de digitação para o título
    const title = document.querySelector('h1');
    const originalText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        title.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    // Inicia a animação de digitação após um breve delay
    setTimeout(typeWriter, 500);
    
    // Efeito de flutuação para os cards
    document.querySelectorAll('.card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
    });

    // =============================================
    // SISTEMA FRØN - FUNCIONAL COMPLETO
    // =============================================
    
    const btnFron = document.getElementById('btnFron');
    const fronStatus = document.getElementById('fronStatus');
    
    let fronAtivo = false;
    let contadorCliques = 0;
    
    // Função principal do botão FRØN
    btnFron.addEventListener('click', function() {
      contadorCliques++;
      
      if (!fronAtivo) {
        // Ativar FRØN
        fronAtivo = true;
        fronStatus.textContent = `FRØN ATIVADO! Sistema em funcionamento - Cliques: ${contadorCliques}`;
        fronStatus.style.background = 'rgba(0, 255, 0, 0.2)';
        fronStatus.style.border = '1px solid #00ff00';
        fronStatus.style.color = '#00ff00';
        btnFron.style.background = 'linear-gradient(135deg, #00ff00, #008800, #006600)';
        btnFron.innerHTML = '<i class="fas fa-check"></i> FRØN ATIVO';
        
        // Efeito visual
        btnFron.style.transform = 'scale(1.2)';
        setTimeout(() => {
          btnFron.style.transform = 'translateY(-5px) scale(1.08)';
        }, 200);
      } else {
        // Desativar FRØN
        fronAtivo = false;
        fronStatus.textContent = `Sistema FRØN: DESATIVADO - Total de cliques: ${contadorCliques}`;
        fronStatus.style.background = 'rgba(255, 0, 0, 0.2)';
        fronStatus.style.border = '1px solid #ff0000';
        fronStatus.style.color = '#ff0000';
        btnFron.style.background = 'linear-gradient(135deg, #8a2be2, #4b0082, #0000ff)';
        btnFron.innerHTML = '<i class="fas fa-fire"></i> FRØN';
      }
    });

    // =============================================
    // SISTEMA ADM SUPREMO - FUNCIONAL
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

    // 🕹️ FUNÇÕES DE NAVEGAÇÃO
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

    // ⚡ INICIALIZAÇÃO DO SISTEMA
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎯 SISTEMA FRØN + ADM SUPREMO INICIADO');
        
        // Auto-focus no campo de usuário se existir
        const usuarioAdm = document.getElementById('usuarioAdm');
        if (usuarioAdm) usuarioAdm.focus();
    });

    console.log('🔄 Sistema integrado: FRØN + ADM Supremo - 100% Funcional');

</script>