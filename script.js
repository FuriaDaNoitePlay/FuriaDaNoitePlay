// =============================================
// SISTEMA DE AUTENTICAÇÃO COM NOSQL
// =============================================

// Configuração do MongoDB
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// Coleções do banco
let db, usuariosCollection, adminsCollection;

async function conectarNoSQL() {
    try {
        await client.connect();
        db = client.db('FuriaDaNoitePlay');
        usuariosCollection = db.collection('usuarios');
        adminsCollection = db.collection('administradores');
        console.log('✅ Conectado ao MongoDB');
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error);
    }
}

// =============================================
// SISTEMA DE LOGIN SEGURO
// =============================================

const adminCredentials = {
    'FURIAGOD': { senha: 'Furia2025_$25', nivel: 'supremo' },
    'Scorpion': { senha: 'Mlk0025', nivel: 'geral' },
    '.Son King': { senha: 'God1925', nivel: 'geral' },
    'NeferpitouI': { senha: 'Ana02525', nivel: 'geral' },
    'PNTS': { senha: 'pNtS25', nivel: 'geral' },
    'ToxicSkull√': { senha: 'L@!on25', nivel: 'geral' }
};

// Função de login
function fazerLogin() {
    const usuario = document.getElementById('login-user').value;
    const senha = document.getElementById('login-password').value;
    
    if (adminCredentials[usuario] && adminCredentials[usuario].senha === senha) {
        // Login bem-sucedido
        localStorage.setItem('adminLogado', usuario);
        localStorage.setItem('adminNivel', adminCredentials[usuario].nivel);
        
        // Redirecionar para o painel
        window.location.href = `painel.html?user=${usuario}&role=${adminCredentials[usuario].nivel}`;
        return true;
    } else {
        alert('❌ Usuário ou senha incorretos!');
        return false;
    }
}

// Verificar se está logado
function verificarLogin() {
    const usuarioLogado = localStorage.getItem('adminLogado');
    const nivelLogado = localStorage.getItem('adminNivel');
    
    if (!usuarioLogado) {
        // Redirecionar para página de login
        window.location.href = 'login.html';
        return false;
    }
    
    return { usuario: usuarioLogado, nivel: nivelLogado };
}

// =============================================
// ATUALIZAÇÃO DO SISTEMA DE PERMISSÕES
// =============================================

function checkPermissions() {
    const loginInfo = verificarLogin();
    if (!loginInfo) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user') || loginInfo.usuario;
    
    if (adminCredentials[user]) {
        currentUser = user;
        currentRole = adminCredentials[user].nivel;
        
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

// =============================================
// FUNÇÕES PARA SALVAR NO NOSQL
// =============================================

// Salvar usuários no MongoDB
async function salvarUsuariosNoSQL() {
    try {
        await usuariosCollection.deleteMany({}); // Limpar coleção
        await usuariosCollection.insertMany(usuarios);
        console.log('✅ Usuários salvos no MongoDB');
    } catch (error) {
        console.error('❌ Erro ao salvar usuários:', error);
    }
}

// Salvar equipes no MongoDB
async function salvarEquipesNoSQL() {
    try {
        await db.collection('equipes').deleteMany({});
        await db.collection('equipes').insertMany(equipes);
        console.log('✅ Equipes salvas no MongoDB');
    } catch (error) {
        console.error('❌ Erro ao salvar equipes:', error);
    }
}

// Carregar dados do MongoDB
async function carregarDadosNoSQL() {
    try {
        usuarios = await usuariosCollection.find({}).toArray();
        equipes = await db.collection('equipes').find({}).toArray();
        console.log('✅ Dados carregados do MongoDB');
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
    }
}

// =============================================
// PÁGINA DE LOGIN (login.html)
// =============================================

/*
Crie um arquivo login.html com:

<div class="login-container">
    <h2>🔐 Login - FuriaDaNoitePlay</h2>
    <input type="text" id="login-user" placeholder="Usuário ADM">
    <input type="password" id="login-password" placeholder="Senha">
    <button onclick="fazerLogin()">Entrar</button>
</div>
*/

// =============================================
// ATUALIZAR FUNÇÕES EXISTENTES
// =============================================

// Modificar funções para salvar no NoSQL
function adicionarUsuario() {
    const nome = prompt('Digite o nome do novo usuário:');
    if (nome) {
        const novoUsuario = {
            id: usuarios.length + 1,
            nome: nome,
            tipo: 'Membro',
            status: 'online',
            pontos: 0,
            dataCriacao: new Date()
        };
        usuarios.push(novoUsuario);
        salvarUsuariosNoSQL(); // ← SALVAR NO NOSQL
        carregarUsuarios();
        alert(`✅ Usuário ${nome} adicionado com sucesso!`);
    }
}

function promoverUsuario(nome) {
    if (confirm(`Promover ${nome} para ADM Geral?`)) {
        const usuario = usuarios.find(u => u.nome === nome);
        if (usuario) {
            usuario.tipo = 'ADM Geral';
            salvarUsuariosNoSQL(); // ← SALVAR NO NOSQL
            carregarUsuarios();
            alert(`✅ ${nome} promovido a ADM Geral!`);
        }
    }
}

// =============================================
// INICIALIZAÇÃO ATUALIZADA
// =============================================

document.addEventListener('DOMContentLoaded', async function() {
    await conectarNoSQL();
    await carregarDadosNoSQL();
    checkPermissions();
    carregarDados();
    atualizarEstatisticas();
});

// =============================================
// LOGOUT
// =============================================

function fazerLogout() {
    localStorage.removeItem('adminLogado');
    localStorage.removeItem('adminNivel');
    window.location.href = 'login.html';
}