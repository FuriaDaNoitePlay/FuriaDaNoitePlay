// =============================================
// SISTEMA FURIA DA NOITE PLAY - SCRIPT ATUALIZADO
// Integrado com o sistema de cadastro funcionando
// =============================================

class FuriaSystem {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.userData = null;
        
        this.init();
    }

    init() {
        console.log('🔄 Sistema Furia inicializando...');
        this.verificarAutenticacao();
        this.configurarEventListeners();
    }

    // =============================================
    // SISTEMA DE AUTENTICAÇÃO ATUALIZADO
    // =============================================

    async fazerLogin(usuario, senha, tipo = 'adm') {
        try {
            // Primeiro tenta login via PHP
            const formData = new FormData();
            formData.append('tipo', tipo);
            formData.append('username', usuario);
            formData.append('password', senha);

            const response = await fetch('login.php', {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();

            if (resultado.success) {
                // Login via PHP bem-sucedido
                this.currentUser = usuario;
                this.currentRole = resultado.user_data?.nivel || 'membro';
                this.userData = resultado.user_data;
                
                this.salvarSessaoLocal();
                this.mostrarPainel();
                return true;
            } else {
                // Fallback para sistema local
                return this.fazerLoginLocal(usuario, senha, tipo);
            }
        } catch (error) {
            console.error('❌ Erro no login PHP:', error);
            // Fallback para sistema local
            return this.fazerLoginLocal(usuario, senha, tipo);
        }
    }

    fazerLoginLocal(usuario, senha, tipo) {
        let loginValido = false;
        
        switch(tipo) {
            case 'adm':
                // Verificar ADMs (mesmas credenciais do sistema principal)
                const admCredentials = {
                    'FURIAGOD': 'Furia2025_$25',
                    'Scorpion': 'Mlk0025',
                    '.Son King': 'God1925',
                    'NeferpitouI': 'Ana02525',
                    'PNTS': 'pNtS25',
                    'ToxicSkull√': 'L@!on25'
                };

                if (admCredentials[usuario] && admCredentials[usuario] === senha) {
                    loginValido = true;
                    this.currentUser = usuario;
                    this.currentRole = (usuario === 'FURIAGOD') ? 'supremo' : 'geral';
                    this.userData = {
                        username: usuario,
                        tipo: 'adm',
                        nivel: this.currentRole
                    };
                }
                break;

            case 'membro':
                // Verificar membros (mesma estrutura do cadastro)
                const usuarios = JSON.parse(localStorage.getItem('furia_usuarios')) || [];
                const usuarioEncontrado = usuarios.find(u => 
                    u.nick === usuario && u.senha === senha
                );
                
                if (usuarioEncontrado) {
                    loginValido = true;
                    this.currentUser = usuario;
                    this.currentRole = 'membro';
                    this.userData = usuarioEncontrado;
                }
                break;

            case 'equipe':
                // Verificar equipes (mesma estrutura do cadastro)
                const equipes = JSON.parse(localStorage.getItem('furia_equipes')) || [];
                const equipeEncontrada = equipes.find(e => 
                    e.nome_equipe === usuario && e.senha === senha
                );
                
                if (equipeEncontrada) {
                    loginValido = true;
                    this.currentUser = usuario;
                    this.currentRole = 'equipe';
                    this.userData = equipeEncontrada;
                }
                break;
        }

        if (loginValido) {
            this.salvarSessaoLocal();
            this.mostrarPainel();
            return true;
        }
        
        return false;
    }

    salvarSessaoLocal() {
        // Padronizar formato de sessão para todo o sistema
        const sessao = {
            user: this.currentUser,
            role: this.currentRole,
            data: this.userData,
            loginTime: new Date().getTime(),
            tipo: this.userData?.tipo || 'adm'
        };
        
        localStorage.setItem('furia_session', JSON.stringify(sessao));
        console.log('✅ Sessão salva:', sessao);
    }

    carregarSessaoLocal() {
        const sessaoSalva = localStorage.getItem('furia_session');
        if (sessaoSalva) {
            try {
                const sessao = JSON.parse(sessaoSalva);
                this.currentUser = sessao.user;
                this.currentRole = sessao.role;
                this.userData = sessao.data;
                return true;
            } catch (error) {
                console.error('❌ Erro ao carregar sessão:', error);
                this.limparSessao();
            }
        }
        return false;
    }

    verificarAutenticacao() {
        // Tenta carregar sessão local primeiro
        if (this.carregarSessaoLocal()) {
            this.mostrarPainel();
            return;
        }

        // Se não há sessão, mostrar login
        this.mostrarLogin();
    }

    limparSessao() {
        localStorage.removeItem('furia_session');
        this.currentUser = null;
        this.currentRole = null;
        this.userData = null;
    }

    fazerLogout() {
        this.limparSessao();
        this.mostrarLogin();
        console.log('🚪 Usuário deslogado');
    }

    // =============================================
    // SISTEMA DE INTERFACE
    // =============================================

    mostrarLogin() {
        // Se já existe uma página de login, redireciona para ela
        if (window.location.pathname.includes('login.html')) {
            return; // Já está na página de login
        }
        
        // Redireciona para a página de login oficial
        window.location.href = 'login.html';
    }

    mostrarPainel() {
        // Redireciona para o painel correto baseado no tipo de usuário
        let redirectUrl = 'furia.html'; // Padrão: página principal
        
        switch(this.userData?.tipo) {
            case 'adm':
                redirectUrl = this.currentRole === 'supremo' ? 'painel-adm.html' : 'painel-usuario.html';
                break;
            case 'membro':
                redirectUrl = 'painel-usuario.html';
                break;
            case 'equipe':
                redirectUrl = 'painel-equipe.html';
                break;
        }

        // Só redireciona se não estiver já na página correta
        if (!window.location.pathname.includes(redirectUrl)) {
            window.location.href = redirectUrl;
        }
    }

    // =============================================
    // SISTEMA DE DADOS COMPATÍVEL COM CADASTRO
    // =============================================

    carregarDadosUsuarios() {
        return JSON.parse(localStorage.getItem('furia_usuarios')) || [];
    }

    carregarDadosEquipes() {
        return JSON.parse(localStorage.getItem('furia_equipes')) || [];
    }

    salvarDadosUsuarios(usuarios) {
        localStorage.setItem('furia_usuarios', JSON.stringify(usuarios));
    }

    salvarDadosEquipes(equipes) {
        localStorage.setItem('furia_equipes', JSON.stringify(equipes));
    }

    // =============================================
    // FUNÇÕES UTILITÁRIAS
    // =============================================

    configurarEventListeners() {
        // Event listeners globais podem ser adicionados aqui
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✅ Sistema Furia carregado');
            
            // Verificar se há sessão ativa
            if (this.carregarSessaoLocal()) {
                console.log('👤 Usuário logado:', this.currentUser);
            }
        });
    }

    // =============================================
    // COMPATIBILIDADE COM CÓDIGO EXISTENTE
    // =============================================

    // Funções para manter compatibilidade com código antigo
    tentarLogin() {
        const user = document.getElementById('loginUser')?.value;
        const pass = document.getElementById('loginPass')?.value;
        
        if (user && pass) {
            this.fazerLogin(user, pass, 'adm');
        } else {
            alert('❌ Preencha usuário e senha!');
        }
    }

    entrarComoVisitante() {
        alert('👤 Modo visitante ativado! Acesso limitado.');
        window.location.href = 'furia.html';
    }

    // =============================================
    // SISTEMA DE VERIFICAÇÃO DE BACKEND
    // =============================================

    async verificarBackend() {
        try {
            const response = await fetch('login.php');
            const data = await response.json();
            console.log('✅ Backend conectado:', data);
            return true;
        } catch (error) {
            console.warn('⚠️ Backend offline, usando modo local');
            return false;
        }
    }

    async verificarCadastroBackend() {
        try {
            const response = await fetch('cadastro.php');
            const data = await response.json();
            console.log('✅ Backend de cadastro conectado:', data);
            return true;
        } catch (error) {
            console.warn('⚠️ Backend de cadastro offline');
            return false;
        }
    }
}

// =============================================
// INICIALIZAÇÃO DO SISTEMA
// =============================================

// Inicializar sistema global
const sistema = new FuriaSystem();

// Exportar para uso global (compatibilidade)
window.sistema = sistema;
window.FuriaSystem = FuriaSystem;

// =============================================
// FUNÇÕES GLOBAIS DE COMPATIBILIDADE
// =============================================

// Funções globais para HTML existente
function tentarLogin() {
    sistema.tentarLogin();
}

function entrarComoVisitante() {
    sistema.entrarComoVisitante();
}

function fazerLogout() {
    sistema.fazerLogout();
}

// =============================================
// INICIALIZAÇÃO AUTOMÁTICA
// =============================================

// Verificar backend ao carregar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 FuriaDaNoitePlay - Sistema carregado');
    
    // Verificar backends
    await sistema.verificarBackend();
    await sistema.verificarCadastroBackend();
    
    // Log de status
    if (sistema.currentUser) {
        console.log(`🎯 Usuário autenticado: ${sistema.currentUser} (${sistema.currentRole})`);
    } else {
        console.log('🔒 Nenhum usuário autenticado');
    }
});

console.log('🚀 Script.js atualizado carregado!');
