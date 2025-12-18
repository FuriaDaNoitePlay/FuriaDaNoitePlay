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
<!-- ADICIONAR APÓS O ÚLTIMO </script> E ANTES DO </body> -->
<script>
// ==================== SISTEMA DE COMUNICAÇÃO DA RIFA ====================

// Função para comunicar seleção com outras páginas
function comunicarSelecaoParaSistema() {
    console.log('📤 Comunicando seleção para o sistema...');
    
    if (selectedNumbers.length === 0) {
        console.log('⚠️ Nenhum número selecionado para comunicar');
        return;
    }
    
    try {
        // Obter dados do localStorage
        const numerosSelecionados = JSON.parse(
            localStorage.getItem('rifa_com_selecionados') || '[]'
        );
        
        const numerosPendentes = JSON.parse(
            localStorage.getItem('rifa_com_pendentes') || '[]'
        );
        
        // Obter nome do usuário
        const nomeUsuario = prompt('Por favor, digite seu nome para confirmar a seleção:') || 'Anônimo';
        
        // Para cada número selecionado
        selectedNumbers.forEach(item => {
            const numero = item.number;
            
            // Verificar se número já foi selecionado
            if (numerosSelecionados.includes(numero)) {
                alert(`⚠️ O número ${numero} já foi selecionado por outra pessoa!`);
                return;
            }
            
            // Adicionar à lista de selecionados
            numerosSelecionados.push(numero);
            
            // Adicionar à lista de pendentes
            numerosPendentes.push({
                numero: numero,
                usuario: nomeUsuario,
                timestamp: Date.now(),
                data: new Date().toISOString()
            });
            
            console.log(`✅ Número ${numero} adicionado às listas de comunicação`);
        });
        
        // Salvar no localStorage
        localStorage.setItem('rifa_com_selecionados', JSON.stringify(numerosSelecionados));
        localStorage.setItem('rifa_com_pendentes', JSON.stringify(numerosPendentes));
        
        // Salvar como última seleção (para notificação)
        const ultimaSelecao = {
            numeros: selectedNumbers.map(item => item.number),
            usuario: nomeUsuario,
            timestamp: Date.now(),
            total: selectedNumbers.length * pricePerNumber
        };
        
        localStorage.setItem('rifa_com_ultimo', JSON.stringify(ultimaSelecao));
        
        // Marcar números como reservados na interface
        marcarNumerosComoReservados();
        
        // Mostrar confirmação
        alert(`✅ Seleção comunicada com sucesso!\n\n📊 Números: ${selectedNumbers.map(n => n.number).join(', ')}\n👤 Nome: ${nomeUsuario}\n💰 Total: R$ ${(selectedNumbers.length * pricePerNumber).toFixed(2)}\n\n📱 O WhatsApp já está aberto com sua mensagem. Envie o comprovante para confirmar!`);
        
        console.log('🎯 Seleção comunicada com sucesso ao sistema!');
        
    } catch (error) {
        console.error('❌ Erro ao comunicar seleção:', error);
        alert('❌ Erro ao processar sua seleção. Por favor, tente novamente.');
    }
}

// Marcar números como reservados na interface
function marcarNumerosComoReservados() {
    selectedNumbers.forEach(item => {
        const card = document.querySelector(`.warrior-card[data-number="${item.number}"]`);
        if (card) {
            card.classList.remove('selected');
            card.classList.add('reserved');
            card.querySelector('.warrior-number').textContent = '✓';
            card.querySelector('.warrior-number').style.color = '#00ff00';
        }
    });
}

// Verificar status dos números ao carregar a página
function verificarStatusNumeros() {
    console.log('🔍 Verificando status dos números...');
    
    const numerosSelecionados = JSON.parse(
        localStorage.getItem('rifa_com_selecionados') || '[]'
    );
    
    const numerosConfirmados = JSON.parse(
        localStorage.getItem('rifa_com_confirmados') || '[]'
    );
    
    // Para cada número de 1 a 31
    for (let i = 1; i <= 31; i++) {
        const card = document.querySelector(`.warrior-card[data-number="${i}"]`);
        if (!card) continue;
        
        if (numerosConfirmados.includes(i)) {
            // Número confirmado (vendido)
            card.classList.add('reserved');
            card.querySelector('.warrior-number').textContent = '✓';
            card.querySelector('.warrior-number').style.color = '#00ff00';
            card.querySelector('.warrior-label').textContent = 'CONFIRMADO';
            card.querySelector('.warrior-label').style.color = '#00ff00';
            card.style.cursor = 'not-allowed';
            card.title = 'Este número já foi vendido e confirmado';
        } else if (numerosSelecionados.includes(i)) {
            // Número selecionado (pendente)
            card.classList.add('reserved');
            card.querySelector('.warrior-number').textContent = '⏳';
            card.querySelector('.warrior-number').style.color = '#ffa500';
            card.querySelector('.warrior-label').textContent = 'PENDENTE';
            card.querySelector('.warrior-label').style.color = '#ffa500';
            card.style.cursor = 'not-allowed';
            card.title = 'Este número está aguardando confirmação de pagamento';
        }
    }
    
    console.log('✅ Status dos números verificado');
}

// Atualizar botão de confirmação para incluir comunicação
function atualizarBotaoConfirmacao() {
    const originalConfirmHandler = confirmBtn.onclick;
    
    confirmBtn.onclick = function() {
        if (selectedNumbers.length === 0) {
            alert('Por favor, selecione pelo menos um número para participar!');
            return;
        }
        
        // Verificar se algum número já está reservado
        const numerosSelecionados = JSON.parse(
            localStorage.getItem('rifa_com_selecionados') || '[]'
        );
        
        const numerosConfirmados = JSON.parse(
            localStorage.getItem('rifa_com_confirmados') || '[]'
        );
        
        const numerosIndisponiveis = selectedNumbers.filter(item => 
            numerosSelecionados.includes(item.number) || 
            numerosConfirmados.includes(item.number)
        );
        
        if (numerosIndisponiveis.length > 0) {
            const numerosLista = numerosIndisponiveis.map(item => item.number).join(', ');
            alert(`⚠️ Os seguintes números já foram selecionados por outras pessoas: ${numerosLista}\n\nPor favor, escolha outros números.`);
            
            // Remover números indisponíveis da seleção
            selectedNumbers = selectedNumbers.filter(item => 
                !numerosSelecionados.includes(item.number) && 
                !numerosConfirmados.includes(item.number)
            );
            
            // Atualizar interface
            updateSelectedNumbersDisplay();
            updateTotalPrice();
            updateWhatsAppButton();
            
            // Remover seleção visual dos cartões
            document.querySelectorAll('.warrior-card').forEach(card => {
                const num = parseInt(card.dataset.number);
                if (numerosIndisponiveis.some(item => item.number === num)) {
                    card.classList.remove('selected');
                }
            });
            
            return;
        }
        
        // Ordenar por número
        selectedNumbers.sort((a, b) => a.number - b.number);
        
        // Criar mensagem detalhada para WhatsApp
        const total = selectedNumbers.length * pricePerNumber;
        
        const message = `📱 *CONFIRMAÇÃO DE SELEÇÃO - RIFA DO GUERREIRO* 📱

✅ *NÚMEROS SELECIONADOS:*
${selectedNumbers.map(item => `➤ ${item.number} - ${item.name}`).join('\n')}

💰 *VALOR TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}
📧 *CHAVE PIX:* furiadanoiteplay2025@gmail.com

👤 *MEU NOME:* [DIGITE SEU NOME AQUI]

📋 *INSTRUÇÕES:*
1️⃣ Vou fazer o PIX agora mesmo
2️⃣ Envio o comprovante nesta conversa
3️⃣ Aguardo a confirmação dos meus números

🎮 *FuriaDaNoitePlay - Comunidade MLBB* 🎮`;
        
        // Abrir WhatsApp automaticamente
        window.open(`https://wa.me/553197319008?text=${encodeURIComponent(message)}`, '_blank');
        
        // Comunicar seleção para o sistema
        comunicarSelecaoParaSistema();
    };
}

// Configurar proteção do botão ADM
function configurarProtecaoADM() {
    document.querySelector('.admin-btn').addEventListener('click', function(e) {
        // Verificar se já está logado
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        const loginTime = localStorage.getItem('adminLoginTime');
        
        if (adminLoggedIn && loginTime) {
            // Verificar tempo da sessão (8 horas)
            const sessionTime = 8 * 60 * 60 * 1000;
            const now = Date.now();
            
            if (now - parseInt(loginTime) <= sessionTime) {
                // Sessão válida, permitir acesso
                return true;
            } else {
                // Sessão expirada
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminLoginTime');
            }
        }
        
        // Solicitar senha
        const password = prompt('🔐 DIGITE A SENHA DE ACESSO AO PAINEL ADM:');
        if (password !== 'FuriaMLBB2024!') {
            e.preventDefault();
            alert('❌ SENHA INCORRETA! ACESSO NEGADO.');
        } else {
            // Salvar login
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminLoginTime', Date.now().toString());
        }
    });
}

// Inicializar sistema de comunicação
function inicializarSistemaComunicacao() {
    console.log('🔗 Inicializando sistema de comunicação da rifa...');
    
    // Verificar se existem dados de comunicação
    if (!localStorage.getItem('rifa_com_selecionados')) {
        localStorage.setItem('rifa_com_selecionados', JSON.stringify([]));
        localStorage.setItem('rifa_com_confirmados', JSON.stringify([]));
        localStorage.setItem('rifa_com_pendentes', JSON.stringify([]));
        console.log('📁 Dados de comunicação inicializados');
    }
    
    // Verificar status dos números
    verificarStatusNumeros();
    
    // Atualizar botão de confirmação
    atualizarBotaoConfirmacao();
    
    // Configurar proteção ADM
    configurarProtecaoADM();
    
    // Configurar ouvinte para atualizações do ADM
    window.addEventListener('storage', function(event) {
        if (event.key === 'rifa_com_confirmados') {
            console.log('🔄 Atualizando status dos números confirmados...');
            verificarStatusNumeros();
        }
    });
    
    console.log('✅ Sistema de comunicação inicializado!');
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que tudo esteja carregado
    setTimeout(inicializarSistemaComunicacao, 1000);
});

// Atualizar botão do WhatsApp dinamicamente
function atualizarBotaoWhatsAppComComunicacao() {
    const originalUpdateWhatsAppButton = updateWhatsAppButton;
    
    updateWhatsAppButton = function() {
        whatsappBtnContainer.innerHTML = '';
        
        if (selectedNumbers.length === 0) {
            // Botão padrão quando não há seleção
            const defaultBtn = document.createElement('a');
            defaultBtn.href = `https://wa.me/553197319008?text=${encodeURIComponent('Olá! Gostaria de participar da Rifa do Guerreiro.')}`;
            defaultBtn.className = 'whatsapp-btn';
            defaultBtn.target = '_blank';
            defaultBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Comprovante no WhatsApp';
            whatsappBtnContainer.appendChild(defaultBtn);
            return;
        }
        
        // Ordenar por número
        selectedNumbers.sort((a, b) => a.number - b.number);
        
        // Criar mensagem detalhada para WhatsApp
        const total = selectedNumbers.length * pricePerNumber;
        
        const message = `📱 *CONFIRMAÇÃO DE SELEÇÃO - RIFA DO GUERREIRO* 📱

✅ *NÚMEROS SELECIONADOS:*
${selectedNumbers.map(item => `➤ ${item.number} - ${item.name}`).join('\n')}

💰 *VALOR TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}
📧 *CHAVE PIX:* furiadanoiteplay2025@gmail.com

👤 *MEU NOME:* [DIGITE SEU NOME AQUI]

📋 *INSTRUÇÕES:*
1️⃣ Vou fazer o PIX agora mesmo
2️⃣ Envio o comprovante nesta conversa
3️⃣ Aguardo a confirmação dos meus números

🎮 *FuriaDaNoitePlay - Comunidade MLBB* 🎮`;
        
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = `https://wa.me/553197319008?text=${encodeURIComponent(message)}`;
        whatsappBtn.className = 'whatsapp-btn';
        whatsappBtn.target = '_blank';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> ENVIAR COMPROVANTE NO WHATSAPP';
        whatsappBtn.id = 'dynamicWhatsAppBtn';
        
        // Adicionar evento para comunicação do sistema
        whatsappBtn.addEventListener('click', function(e) {
            // Não prevenir o comportamento padrão (abrir WhatsApp)
            // A comunicação do sistema será feita pelo botão CONFIRMAR SELEÇÃO
        });
        
        whatsappBtnContainer.appendChild(whatsappBtn);
    };
    
    // Substituir a função original
    updateWhatsAppButton();
}

// Substituir a função updateWhatsAppButton
atualizarBotaoWhatsAppComComunicacao();

// Adicionar Font Awesome se não estiver presente
if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
}

console.log('🎮 Sistema de Rifa do Guerreiro com Comunicação carregado!');
</script>
