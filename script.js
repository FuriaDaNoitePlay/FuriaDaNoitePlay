// =============================================
// SISTEMA COMPLETO - PAINEL ADM FuriaDaNoitePlay
// =============================================

// Sistema de Permissões
const permissions = {
    'FURIAGOD': 'supremo',
    'Scorpion': 'geral', 
    '.Son King': 'geral',
    'NeferpitouI': 'geral',
    'PNTS': 'geral',
    'ToxicSkull√': 'geral',
    'Superman': 'superman'
};

let currentUser = 'FURIAGOD';
let currentRole = 'supremo';

// Dados do sistema
let usuarios = [
    { id: 1, nome: 'FURIAGOD', tipo: 'ADM Supremo', status: 'online', pontos: 0 },
    { id: 2, nome: 'Scorpion', tipo: 'ADM Geral', status: 'online', pontos: 0 },
    { id: 3, nome: '.Son King', tipo: 'ADM Geral', status: 'online', pontos: 0 },
    { id: 4, nome: 'ToxicSkull√', tipo: 'Membro', status: 'online', pontos: 150 },
    { id: 5, nome: 'NeferpitouI', tipo: 'ADM Geral', status: 'offline', pontos: 0 },
    { id: 6, nome: 'PNTS', tipo: 'ADM Geral', status: 'offline', pontos: 0 },
    { id: 7, nome: 'Superman', tipo: 'Superman', status: 'online', pontos: 0 }
];

let equipes = [
    { id: 1, nome: 'FÚRIA DA NOITE', serie: 'a', pontos: 36, status: 'ativa' },
    { id: 2, nome: 'NEON ESPORTS', serie: 'a', pontos: 34, status: 'ativa' },
    { id: 3, nome: 'ECHO TEAM ACADEMY', serie: 'b', pontos: 34, status: 'ativa' },
    { id: 4, nome: 'DRAGONS ESPORTS', serie: 'c', pontos: 28, status: 'ativa' }
];

let tabelaClassificacao = [
    { posicao: 1, equipe: 'FÚRIA DA NOITE', pontos: 36, jogos: 12, vitorias: 12, derrotas: 0 },
    { posicao: 2, equipe: 'NEON ESPORTS', pontos: 34, jogos: 12, vitorias: 11, derrotas: 1 },
    { posicao: 3, equipe: 'ECHO TEAM ACADEMY', pontos: 34, jogos: 12, vitorias: 11, derrotas: 1 },
    { posicao: 4, equipe: 'DRAGONS ESPORTS', pontos: 28, jogos: 12, vitorias: 9, derrotas: 3 }
];

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', function() {
    checkPermissions();
    carregarDados();
    atualizarEstatisticas();
});

// Função para verificar permissões
function checkPermissions() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user') || 'FURIAGOD';
    
    if (permissions[user]) {
        currentUser = user;
        currentRole = permissions[user];
        
        document.getElementById('current-admin').textContent = user;
        document.getElementById('current-role').textContent = 
            currentRole === 'supremo' ? 'ADM Supremo' : 
            currentRole === 'superman' ? 'Superman' : 'ADM Geral';
        
        // Ocultar seções restritas se não for supremo
        if (currentRole !== 'supremo') {
            const admTab = document.querySelector('.nav-tab[onclick*="admins"]');
            if (admTab) admTab.style.display = 'none';
        }
    }
}

// Função para mostrar seções
function mostrarSecao(secao) {
    // Verificar permissões para a seção de ADMs
    if (secao === 'admins' && currentRole !== 'supremo') {
        alert('⚠️ Apenas ADMs Supremos podem acessar o gerenciamento de ADMs!');
        return;
    }

    // Esconder todas as seções
    document.querySelectorAll('.secao').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    // Mostrar seção selecionada
    document.getElementById(secao).classList.add('active');
    
    // Ativar aba correspondente
    document.querySelectorAll('.nav-tab').forEach(tab => {
        if (tab.onclick && tab.onclick.toString().includes(secao)) {
            tab.classList.add('active');
        }
    });

    // Carregar dados específicos da seção
    switch(secao) {
        case 'usuarios':
            carregarUsuarios();
            break;
        case 'equipes':
            carregarEquipes();
            break;
        case 'tabelas':
            carregarTabela();
            break;
        case 'admins':
            carregarADMs();
            break;
    }
}

// ===== FUNÇÕES DO DASHBOARD =====
function carregarDados() {
    atualizarEstatisticas();
}

function atualizarEstatisticas() {
    document.getElementById('total-equipes').textContent = equipes.length;
    document.getElementById('total-jogadores').textContent = usuarios.length;
    document.getElementById('campeonatos-ativos').textContent = '3';
}

// ===== GERENCIAMENTO DE USUÁRIOS =====
function carregarUsuarios() {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const statusClass = usuario.status === 'online' ? 'status-online' : 'status-offline';
        const statusSymbol = usuario.status === 'online' ? '●' : '○';
        
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <div class="user-info-small">
                <div class="user-avatar-small" style="background: linear-gradient(135deg, #ff0000, #cc0000);">
                    ${usuario.nome.charAt(0)}
                </div>
                <div>
                    <strong>${usuario.nome}</strong>
                    <div style="font-size: 0.8rem; color: #ccc;">${usuario.tipo}</div>
                </div>
            </div>
            <div>
                <span class="${statusClass}" style="margin-right: 15px;">${statusSymbol} ${usuario.status.toUpperCase()}</span>
                ${usuario.tipo.includes('ADM') ? 
                    `<button class="btn btn-warning" onclick="editarUsuario('${usuario.nome}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>` : 
                    `<button class="btn btn-success" onclick="promoverUsuario('${usuario.nome}')">
                        <i class="fas fa-arrow-up"></i> Promover
                    </button>
                    <button class="btn btn-danger" onclick="banirUsuario('${usuario.nome}')">
                        <i class="fas fa-ban"></i> Banir
                    </button>`
                }
            </div>
        `;
        lista.appendChild(userItem);
    });
}

function filtrarUsuarios() {
    const termo = document.getElementById('pesquisaUsuario').value.toLowerCase();
    const usuariosFiltrados = usuarios.filter(usuario => 
        usuario.nome.toLowerCase().includes(termo)
    );
    
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = '';
    
    usuariosFiltrados.forEach(usuario => {
        const statusClass = usuario.status === 'online' ? 'status-online' : 'status-offline';
        const statusSymbol = usuario.status === 'online' ? '●' : '○';
        
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <div class="user-info-small">
                <div class="user-avatar-small" style="background: linear-gradient(135deg, #ff0000, #cc0000);">
                    ${usuario.nome.charAt(0)}
                </div>
                <div>
                    <strong>${usuario.nome}</strong>
                    <div style="font-size: 0.8rem; color: #ccc;">${usuario.tipo}</div>
                </div>
            </div>
            <div>
                <span class="${statusClass}" style="margin-right: 15px;">${statusSymbol} ${usuario.status.toUpperCase()}</span>
                ${usuario.tipo.includes('ADM') ? 
                    `<button class="btn btn-warning" onclick="editarUsuario('${usuario.nome}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>` : 
                    `<button class="btn btn-success" onclick="promoverUsuario('${usuario.nome}')">
                        <i class="fas fa-arrow-up"></i> Promover
                    </button>
                    <button class="btn btn-danger" onclick="banirUsuario('${usuario.nome}')">
                        <i class="fas fa-ban"></i> Banir
                    </button>`
                }
            </div>
        `;
        lista.appendChild(userItem);
    });
}

function adicionarUsuario() {
    const nome = prompt('Digite o nome do novo usuário:');
    if (nome) {
        const novoUsuario = {
            id: usuarios.length + 1,
            nome: nome,
            tipo: 'Membro',
            status: 'online',
            pontos: 0
        };
        usuarios.push(novoUsuario);
        carregarUsuarios();
        alert(`✅ Usuário ${nome} adicionado com sucesso!`);
    }
}

function promoverUsuario(nome) {
    if (confirm(`Promover ${nome} para ADM Geral?`)) {
        const usuario = usuarios.find(u => u.nome === nome);
        if (usuario) {
            usuario.tipo = 'ADM Geral';
            carregarUsuarios();
            alert(`✅ ${nome} promovido a ADM Geral!`);
        }
    }
}

function banirUsuario(nome) {
    if (confirm(`Banir permanentemente o usuário ${nome}?`)) {
        usuarios = usuarios.filter(u => u.nome !== nome);
        carregarUsuarios();
        alert(`✅ Usuário ${nome} foi banido!`);
    }
}

function editarUsuario(nome) {
    const usuario = usuarios.find(u => u.nome === nome);
    if (usuario) {
        const novoNome = prompt(`Editar nome de ${nome}:`, nome);
        if (novoNome) {
            usuario.nome = novoNome;
            carregarUsuarios();
            alert(`✅ Usuário renomeado para ${novoNome}!`);
        }
    }
}

// ===== GERENCIAMENTO DE EQUIPES =====
function carregarEquipes() {
    const lista = document.getElementById('lista-equipes');
    lista.innerHTML = '';
    
    equipes.forEach(equipe => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-item';
        teamItem.innerHTML = `
            <div class="user-info-small">
                <div class="user-avatar-small" style="background: linear-gradient(135deg, #0066ff, #0044cc);">
                    ${equipe.nome.substring(0, 2)}
                </div>
                <div>
                    <strong>${equipe.nome}</strong>
                    <div style="font-size: 0.8rem; color: #ccc;">Série ${equipe.serie.toUpperCase()} • ${equipe.pontos} pontos</div>
                </div>
            </div>
            <div>
                <button class="btn btn-warning" onclick="editarEquipe('${equipe.nome}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-primary" onclick="transferirEquipe('${equipe.nome}')">
                    <i class="fas fa-exchange-alt"></i> Transferir
                </button>
                <button class="btn btn-danger" onclick="removerEquipe('${equipe.nome}')">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `;
        lista.appendChild(teamItem);
    });
}

function filtrarEquipes() {
    const serie = document.getElementById('filtroSerie').value;
    const equipesFiltradas = serie === 'todas' ? equipes : equipes.filter(e => e.serie === serie);
    
    const lista = document.getElementById('lista-equipes');
    lista.innerHTML = '';
    
    equipesFiltradas.forEach(equipe => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-item';
        teamItem.innerHTML = `
            <div class="user-info-small">
                <div class="user-avatar-small" style="background: linear-gradient(135deg, #0066ff, #0044cc);">
                    ${equipe.nome.substring(0, 2)}
                </div>
                <div>
                    <strong>${equipe.nome}</strong>
                    <div style="font-size: 0.8rem; color: #ccc;">Série ${equipe.serie.toUpperCase()} • ${equipe.pontos} pontos</div>
                </div>
            </div>
            <div>
                <button class="btn btn-warning" onclick="editarEquipe('${equipe.nome}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-primary" onclick="transferirEquipe('${equipe.nome}')">
                    <i class="fas fa-exchange-alt"></i> Transferir
                </button>
                <button class="btn btn-danger" onclick="removerEquipe('${equipe.nome}')">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `;
        lista.appendChild(teamItem);
    });
}

function criarNovaEquipe() {
    const nome = prompt('Digite o nome da nova equipe:');
    const serie = prompt('Digite a série (A, B ou C):').toLowerCase();
    
    if (nome && ['a', 'b', 'c'].includes(serie)) {
        const novaEquipe = {
            id: equipes.length + 1,
            nome: nome.toUpperCase(),
            serie: serie,
            pontos: 0,
            status: 'ativa'
        };
        equipes.push(novaEquipe);
        carregarEquipes();
        alert(`✅ Equipe ${nome} criada na Série ${serie.toUpperCase()}!`);
    }
}

function editarEquipe(nome) {
    const equipe = equipes.find(e => e.nome === nome);
    if (equipe) {
        const novosPontos = prompt(`Editar pontos para ${nome}:`, equipe.pontos);
        if (novosPontos !== null) {
            equipe.pontos = parseInt(novosPontos);
            carregarEquipes();
            alert(`✅ Pontuação de ${nome} atualizada para ${novosPontos}!`);
        }
    }
}

function transferirEquipe(nome) {
    const equipe = equipes.find(e => e.nome === nome);
    if (equipe) {
        const novaSerie = prompt(`Transferir ${nome} para qual série? (A, B, C):`).toLowerCase();
        if (['a', 'b', 'c'].includes(novaSerie)) {
            equipe.serie = novaSerie;
            carregarEquipes();
            alert(`✅ ${nome} transferida para Série ${novaSerie.toUpperCase()}!`);
        }
    }
}

function removerEquipe(nome) {
    if (confirm(`Remover equipe ${nome} permanentemente?`)) {
        equipes = equipes.filter(e => e.nome !== nome);
        carregarEquipes();
        alert(`✅ Equipe ${nome} removida!`);
    }
}

// ===== TABELAS E CONFRONTOS =====
function carregarTabela() {
    const tbody = document.getElementById('tabela-classificacao');
    tbody.innerHTML = '';
    
    tabelaClassificacao.forEach(time => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${time.posicao}º</td>
            <td><strong>${time.equipe}</strong></td>
            <td>${time.pontos}</td>
            <td>${time.jogos}</td>
            <td>${time.vitorias}</td>
            <td>${time.derrotas}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarPontuacao('${time.equipe}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="resetarTime('${time.equipe}')">
                    <i class="fas fa-redo"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarPontuacao(equipeNome) {
    const time = tabelaClassificacao.find(t => t.equipe === equipeNome);
    if (time) {
        const novosPontos = prompt(`Editar pontos para ${equipeNome}:`, time.pontos);
        if (novosPontos !== null) {
            time.pontos = parseInt(novosPontos);
            carregarTabela();
            alert(`✅ Pontuação de ${equipeNome} atualizada para ${novosPontos}!`);
        }
    }
}

function resetarTime(equipeNome) {
    if (confirm(`Resetar estatísticas de ${equipeNome}?`)) {
        const time = tabelaClassificacao.find(t => t.equipe === equipeNome);
        if (time) {
            time.pontos = 0;
            time.jogos = 0;
            time.vitorias = 0;
            time.derrotas = 0;
            carregarTabela();
            alert(`✅ Estatísticas de ${equipeNome} resetadas!`);
        }
    }
}

function adicionarConfronto() {
    alert('🎯 Funcionalidade de adicionar confronto em desenvolvimento...');
}

function atualizarTabela() {
    carregarTabela();
    alert('✅ Tabela atualizada!');
}

// ===== GERENCIAMENTO DE ADMs =====
function carregarADMs() {
    const lista = document.getElementById('lista-adms');
    lista.innerHTML = '';
    
    const adms = usuarios.filter(u => u.tipo.includes('ADM') || u.tipo === 'Superman');
    
    adms.forEach(adm => {
        const statusClass = adm.status === 'online' ? 'status-online' : 'status-offline';
        const statusSymbol = adm.status === 'online' ? '●' : '○';
        const badgeClass = adm.tipo === 'ADM Supremo' ? 'badge-supremo' : 
                          adm.tipo === 'Superman' ? 'badge-superman' : 'badge-geral';
        
        const admItem = document.createElement('div');
        admItem.className = 'user-item';
        admItem.innerHTML = `
            <div class="user-info-small">
                <div class="user-avatar-small" style="background: linear-gradient(135deg, #ff0000, #cc0000);">
                    ${adm.nome.charAt(0)}
                </div>
                <div>
                    <strong>${adm.nome}</strong>
                    <div class="permission-badge ${badgeClass}">${adm.tipo}</div>
                </div>
            </div>
            <div>
                <span class="${statusClass}" style="margin-right: 15px;">${statusSymbol} ${adm.status.toUpperCase()}</span>
                ${currentRole === 'supremo' && adm.tipo !== 'ADM Supremo' ? 
                    `<button class="btn btn-warning" onclick="editarAdm('${adm.nome}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger" onclick="rebaixarAdm('${adm.nome}')">
                        ⬇️ Rebaixar
                    </button>` : 
                    `<button class="btn btn-warning" disabled>
                        👑 Supremo
                    </button>`
                }
            </div>
        `;
        lista.appendChild(admItem);
    });
}

function filtrarADMs() {
    const termo = document.getElementById('pesquisaAdm').value.toLowerCase();
    const admsFiltrados = usuarios.filter(u => 
        (u.tipo.includes('ADM') || u.tipo === 'Superman') && 
        u.nome.toLowerCase().includes(termo)
    );
    
    const lista = document.getElementById('lista-adms');
    lista.innerHTML = '';
    
    admsFiltrados.forEach(adm => {
        const statusClass = adm.status === 'online' ? 'status-online' : 'status-offline';
        const statusSymbol = adm.status === 'online' ? '●' : '○';
        const badgeClass = adm.tipo === 'ADM Supremo' ? 'badge-supremo' : 
                          adm.tipo === 'Superman' ? 'badge-superman' : 'badge-geral';
        
        const admItem = document.createElement('div');
        admItem.className = 'user-item';
        admItem.innerHTML = `
            <div class="user-info-small">
                <div class="user-avatar-small" style="background: linear-gradient(135deg, #ff0000, #cc0000);">
                    ${adm.nome.charAt(0)}
                </div>
                <div>
                    <strong>${adm.nome}</strong>
                    <div class="permission-badge ${badgeClass}">${adm.tipo}</div>
                </div>
            </div>
            <div>
                <span class="${statusClass}" style="margin-right: 15px;">${statusSymbol} ${adm.status.toUpperCase()}</span>
                ${currentRole === 'supremo' && adm.tipo !== 'ADM Supremo' ? 
                    `<button class="btn btn-warning" onclick="editarAdm('${adm.nome}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger" onclick="rebaixarAdm('${adm.nome}')">
                        ⬇️ Rebaixar
                    </button>` : 
                    `<button class="btn btn-warning" disabled>
                        👑 Supremo
                    </button>`
                }
            </div>
        `;
        lista.appendChild(admItem);
    });
}

function criarNovoAdm() {
    if (currentRole !== 'supremo') {
        alert('⚠️ Apenas ADMs Supremos podem criar novos administrad