// ==================== SISTEMA DE COMUNICAÇÃO DA RIFA ====================
// (Adicione este código NO FINAL do seu script.js existente)

const RIFA_COMUNICACAO = {
    // Chaves para comunicação entre páginas
    CHAVES: {
        NUMEROS_SELECIONADOS: 'rifa_com_selecionados',
        NUMEROS_CONFIRMADOS: 'rifa_com_confirmados',
        ULTIMO_SELECIONADO: 'rifa_com_ultimo',
        PENDENTES_ADM: 'rifa_com_pendentes',
        EVENTO_RIFA: 'rifa_com_evento'
    },
    
    // Configurações
    CONFIG: {
        TOTAL_NUMEROS: 31,
        SENHA_ADM: 'FuriaMLBB2024!'
    }
};

// ==================== FUNÇÕES DE COMUNICAÇÃO ====================

// Inicializar sistema de comunicação
function inicializarComunicacaoRifa() {
    console.log('📡 Iniciando sistema de comunicação da rifa...');
    
    // Criar dados se não existirem
    if (!localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS)) {
        localStorage.setItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS, JSON.stringify([]));
        localStorage.setItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_CONFIRMADOS, JSON.stringify([]));
        localStorage.setItem(RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM, JSON.stringify([]));
        console.log('✅ Dados de comunicação criados');
    }
    
    // Configurar ouvinte para eventos entre páginas
    configurarOuvinteComunicacao();
    
    // Verificar se está na página comum.html para configurar eventos
    if (window.location.pathname.includes('comun.html') || 
        window.location.pathname.includes('index.html')) {
        configurarPaginaComum();
    }
}

// Configurar ouvinte de eventos entre abas/páginas
function configurarOuvinteComunicacao() {
    window.addEventListener('storage', function(event) {
        // Quando algo muda no localStorage (comunicação entre abas)
        if (event.key && event.key.startsWith('rifa_com_')) {
            console.log('📬 Evento recebido:', event.key, event.newValue);
            
            // Disparar evento personalizado para a página atual
            window.dispatchEvent(new CustomEvent('rifaMudancaDados', {
                detail: {
                    chave: event.key,
                    valor: event.newValue ? JSON.parse(event.newValue) : null,
                    antigo: event.oldValue ? JSON.parse(event.oldValue) : null
                }
            }));
            
            // Se for novo número selecionado
            if (event.key === RIFA_COMUNICACAO.CHAVES.ULTIMO_SELECIONADO && event.newValue) {
                try {
                    const dados = JSON.parse(event.newValue);
                    if (dados && dados.numero) {
                        window.dispatchEvent(new CustomEvent('rifaNovoNumero', {
                            detail: dados
                        }));
                        
                        // Mostrar notificação se a função existir
                        if (typeof mostrarNotificacaoRifa === 'function') {
                            mostrarNotificacaoRifa(`🎯 Novo número ${dados.numero} selecionado!`);
                        }
                    }
                } catch (e) {
                    console.error('Erro ao processar evento:', e);
                }
            }
        }
    });
}

// ==================== FUNÇÕES PARA RIFA.HTML ====================

// Quando usuário seleciona número na rifa.html
function comunicarSelecaoNumero(numero, dadosUsuario) {
    console.log(`📤 Comunicando seleção do número ${numero}...`);
    
    try {
        // 1. Obter números já selecionados
        const selecionados = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS) || '[]'
        );
        
        // 2. Verificar se número já foi selecionado
        if (selecionados.includes(numero)) {
            return { success: false, message: `Número ${numero} já selecionado!` };
        }
        
        // 3. Adicionar à lista de selecionados
        selecionados.push(numero);
        localStorage.setItem(
            RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS,
            JSON.stringify(selecionados)
        );
        
        // 4. Adicionar à lista de pendentes (aguardando ADM)
        const pendentes = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM) || '[]'
        );
        
        pendentes.push({
            numero: numero,
            usuario: dadosUsuario.nome || 'Anônimo',
            telefone: dadosUsuario.telefone || '',
            data: new Date().toISOString(),
            timestamp: Date.now()
        });
        
        localStorage.setItem(
            RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM,
            JSON.stringify(pendentes)
        );
        
        // 5. Salvar como último selecionado (para notificação)
        const ultimoSelecionado = {
            numero: numero,
            usuario: dadosUsuario.nome || 'Anônimo',
            timestamp: Date.now(),
            data: new Date().toLocaleString('pt-BR')
        };
        
        localStorage.setItem(
            RIFA_COMUNICACAO.CHAVES.ULTIMO_SELECIONADO,
            JSON.stringify(ultimoSelecionado)
        );
        
        // 6. Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('rifaNumeroSelecionadoComSucesso', {
            detail: {
                numero: numero,
                usuario: dadosUsuario.nome || 'Anônimo',
                totalSelecionados: selecionados.length,
                disponiveis: RIFA_COMUNICACAO.CONFIG.TOTAL_NUMEROS - selecionados.length
            }
        }));
        
        console.log('✅ Seleção comunicada com sucesso!');
        return {
            success: true,
            message: `Número ${numero} selecionado com sucesso!`,
            numero: numero,
            totalSelecionados: selecionados.length
        };
        
    } catch (error) {
        console.error('❌ Erro ao comunicar seleção:', error);
        return {
            success: false,
            message: 'Erro ao processar seleção'
        };
    }
}

// ==================== FUNÇÕES PARA ADM.HTML ====================

// Quando ADM confirma um número
function comunicarConfirmacaoADM(numero) {
    console.log(`📤 ADM confirmando número ${numero}...`);
    
    try {
        // 1. Obter listas
        const pendentes = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM) || '[]'
        );
        
        const confirmados = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_CONFIRMADOS) || '[]'
        );
        
        // 2. Encontrar e remover dos pendentes
        const pendenteIndex = pendentes.findIndex(p => p.numero === numero);
        if (pendenteIndex === -1) {
            return { success: false, message: `Número ${numero} não encontrado nos pendentes` };
        }
        
        const [dadosPendente] = pendentes.splice(pendenteIndex, 1);
        localStorage.setItem(
            RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM,
            JSON.stringify(pendentes)
        );
        
        // 3. Adicionar aos confirmados
        confirmados.push({
            ...dadosPendente,
            confirmadoPor: 'ADM',
            dataConfirmacao: new Date().toISOString(),
            status: 'CONFIRMADO'
        });
        
        localStorage.setItem(
            RIFA_COMUNICACAO.CHAVES.NUMEROS_CONFIRMADOS,
            JSON.stringify(confirmados)
        );
        
        // 4. Disparar evento
        window.dispatchEvent(new CustomEvent('rifaNumeroConfirmadoADM', {
            detail: {
                numero: numero,
                usuario: dadosPendente.usuario,
                dataConfirmacao: new Date().toISOString()
            }
        }));
        
        // 5. Disparar evento de storage para outras páginas
        localStorage.setItem('rifa_ultima_confirmacao', JSON.stringify({
            numero: numero,
            usuario: dadosPendente.usuario,
            timestamp: Date.now()
        }));
        
        console.log('✅ Confirmação ADM comunicada!');
        return {
            success: true,
            message: `Número ${numero} confirmado com sucesso!`,
            numero: numero
        };
        
    } catch (error) {
        console.error('❌ Erro ao confirmar número ADM:', error);
        return {
            success: false,
            message: 'Erro ao confirmar número'
        };
    }
}

// Quando ADM cancela um número
function comunicarCancelamentoADM(numero) {
    console.log(`📤 ADM cancelando número ${numero}...`);
    
    try {
        // 1. Remover dos selecionados
        let selecionados = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS) || '[]'
        );
        
        selecionados = selecionados.filter(n => n !== numero);
        localStorage.setItem(
            RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS,
            JSON.stringify(selecionados)
        );
        
        // 2. Remover dos pendentes
        let pendentes = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM) || '[]'
        );
        
        pendentes = pendentes.filter(p => p.numero !== numero);
        localStorage.setItem(
            RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM,
            JSON.stringify(pendentes)
        );
        
        // 3. Disparar evento
        window.dispatchEvent(new CustomEvent('rifaNumeroCanceladoADM', {
            detail: { numero: numero }
        }));
        
        console.log('✅ Cancelamento ADM comunicado!');
        return {
            success: true,
            message: `Número ${numero} cancelado com sucesso!`,
            numero: numero
        };
        
    } catch (error) {
        console.error('❌ Erro ao cancelar número ADM:', error);
        return {
            success: false,
            message: 'Erro ao cancelar número'
        };
    }
}

// ==================== FUNÇÕES PARA COMUN.HTML ====================

function configurarPaginaComum() {
    console.log('⚙️ Configurando página comum.html para comunicação...');
    
    // 1. Atualizar estatísticas automaticamente
    function atualizarEstatisticasComum() {
        const selecionados = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS) || '[]'
        );
        
        const confirmados = JSON.parse(
            localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_CONFIRMADOS) || '[]'
        );
        
        const total = RIFA_COMUNICACAO.CONFIG.TOTAL_NUMEROS;
        const selecionadosCount = selecionados.length;
        const confirmadosCount = confirmados.length;
        const disponiveis = total - selecionadosCount;
        const percentual = ((selecionadosCount / total) * 100).toFixed(1);
        
        // Atualizar elementos na página (se existirem)
        const elementos = {
            totalNumbers: document.getElementById('totalNumbers'),
            selectedNumbers: document.getElementById('selectedNumbers'),
            availableNumbers: document.getElementById('availableNumbers'),
            confirmedNumbers: document.getElementById('confirmedNumbers'),
            selectedPercent: document.getElementById('selectedPercent'),
            recentNumbers: document.getElementById('recentNumbers')
        };
        
        // Atualizar cada elemento se existir
        if (elementos.selectedNumbers) elementos.selectedNumbers.textContent = selecionadosCount;
        if (elementos.confirmedNumbers) elementos.confirmedNumbers.textContent = confirmadosCount;
        if (elementos.availableNumbers) elementos.availableNumbers.textContent = disponiveis;
        if (elementos.selectedPercent) elementos.selectedPercent.textContent = `${percentual}%`;
        
        // Atualizar números recentes
        if (elementos.recentNumbers) {
            elementos.recentNumbers.innerHTML = '';
            
            if (selecionados.length === 0) {
                elementos.recentNumbers.innerHTML = 
                    '<p style="color: #888; text-align: center; width: 100%;">Nenhum guerreiro selecionado ainda. Seja o primeiro!</p>';
            } else {
                // Mostrar últimos 10 números
                const recentes = selecionados.slice(-10).reverse();
                recentes.forEach(num => {
                    const badge = document.createElement('div');
                    badge.className = 'number-badge';
                    badge.textContent = num;
                    badge.title = `Guerreiro ${num}`;
                    elementos.recentNumbers.appendChild(badge);
                });
            }
        }
        
        console.log('📊 Estatísticas atualizadas:', { selecionadosCount, confirmadosCount, disponiveis });
    }
    
    // 2. Mostrar notificação quando novo número for selecionado
    function mostrarNotificacaoRifa(mensagem) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        if (notification && notificationText) {
            notificationText.textContent = mensagem;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        } else {
            // Criar notificação dinâmica se não existir
            const notif = document.createElement('div');
            notif.id = 'dynamicRifaNotification';
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #333, #111);
                border: 2px solid #ff0000;
                border-radius: 10px;
                padding: 15px;
                color: white;
                z-index: 10000;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
                animation: slideIn 0.5s ease;
                max-width: 300px;
            `;
            notif.innerHTML = `
                <h4 style="color: #ff4444; margin-bottom: 5px;">🎉 NOVA SELEÇÃO!</h4>
                <p>${mensagem}</p>
            `;
            
            document.body.appendChild(notif);
            
            setTimeout(() => {
                notif.style.animation = 'slideOut 0.5s ease';
                setTimeout(() => {
                    if (notif.parentNode) notif.parentNode.removeChild(notif);
                }, 500);
            }, 5000);
            
            // Adicionar animação CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 3. Configurar eventos
    window.addEventListener('rifaMudancaDados', function(event) {
        console.log('📡 Evento rifaMudancaDados recebido:', event.detail);
        atualizarEstatisticasComum();
    });
    
    window.addEventListener('rifaNovoNumero', function(event) {
        console.log('🎯 Novo número selecionado:', event.detail);
        mostrarNotificacaoRifa(`GUERREIRO ${event.detail.numero} FOI SELECIONADO! 🎮`);
        atualizarEstatisticasComum();
    });
    
    // 4. Configurar botão ADM
    const adminBtn = document.querySelector('.nav-btn.adm') || 
                     document.querySelector('.admin-btn') ||
                     document.querySelector('.admin-btn-fixed');
    
    if (adminBtn) {
        adminBtn.addEventListener('click', function(e) {
            const password = prompt('🔐 DIGITE A SENHA DE ACESSO AO PAINEL ADM:');
            if (password !== RIFA_COMUNICACAO.CONFIG.SENHA_ADM) {
                e.preventDefault();
                alert('❌ SENHA INCORRETA! ACESSO NEGADO.');
            }
        });
    }
    
    // 5. Inicializar
    setTimeout(() => {
        atualizarEstatisticasComum();
        console.log('✅ Página comum.html configurada para comunicação!');
    }, 1000);
}

// ==================== FUNÇÕES DE CONSULTA ====================

// Obter estatísticas atuais
function obterEstatisticasComunicacao() {
    const selecionados = JSON.parse(
        localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS) || '[]'
    );
    
    const confirmados = JSON.parse(
        localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_CONFIRMADOS) || '[]'
    );
    
    const pendentes = JSON.parse(
        localStorage.getItem(RIFA_COMUNICACAO.CHAVES.PENDENTES_ADM) || '[]'
    );
    
    const total = RIFA_COMUNICACAO.CONFIG.TOTAL_NUMEROS;
    const selecionadosCount = selecionados.length;
    const confirmadosCount = confirmados.length;
    const pendentesCount = pendentes.length;
    const disponiveis = total - selecionadosCount;
    
    return {
        total: total,
        selecionados: selecionadosCount,
        confirmados: confirmadosCount,
        pendentes: pendentesCount,
        disponiveis: disponiveis,
        percentualSelecionados: ((selecionadosCount / total) * 100).toFixed(1),
        percentualConfirmados: ((confirmadosCount / total) * 100).toFixed(1),
        listaSelecionados: selecionados,
        listaConfirmados: confirmados,
        listaPendentes: pendentes
    };
}

// Verificar se número está disponível
function verificarNumeroDisponivel(numero) {
    const selecionados = JSON.parse(
        localStorage.getItem(RIFA_COMUNICACAO.CHAVES.NUMEROS_SELECIONADOS) || '[]'
    );
    
    return !selecionados.includes(numero) && 
           numero >= 1 && 
           numero <= RIFA_COMUNICACAO.CONFIG.TOTAL_NUMEROS;
}

// ==================== INICIALIZAÇÃO ====================

// Inicializar quando o DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarComunicacaoRifa);
} else {
    inicializarComunicacaoRifa();
}

// Exportar funções para uso global
window.RifaComunicacao = {
    inicializar: inicializarComunicacaoRifa,
    selecionarNumero: comunicarSelecaoNumero,
    confirmarNumero: comunicarConfirmacaoADM,
    cancelarNumero: comunicarCancelamentoADM,
    obterEstatisticas: obterEstatisticasComunicacao,
    verificarDisponivel: verificarNumeroDisponivel,
    CONFIG: RIFA_COMUNICACAO.CONFIG
};

console.log('📡 Sistema de comunicação da rifa carregado!');
