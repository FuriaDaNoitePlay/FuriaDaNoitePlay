// =============================================
// SISTEMA COMPLETO FURIA DA NOITE PLAY - COM ADSENSE
// Arquivo único - Compatível com GitHub Pages
// =============================================

// Configuração do sistema
class FuriaSystem {
    constructor() {
        this.adminCredentials = {
            'FURIAGOD': { senha: 'Furia2025_$25', nivel: 'supremo' },
            'Scorpion': { senha: 'Mlk0025', nivel: 'geral' },
            '.Son King': { senha: 'God1925', nivel: 'geral' },
            'NeferpitouI': { senha: 'Ana02525', nivel: 'geral' },
            'PNTS': { senha: 'pNtS25', nivel: 'geral' },
            'ToxicSkull√': { senha: 'L@!on25', nivel: 'geral' }
        };

        this.usuarios = [];
        this.equipes = [];
        this.tabelaClassificacao = [];
        this.currentUser = null;
        this.currentRole = null;

        this.init();
    }

    init() {
        this.carregarDados();
        this.verificarAutenticacao();
        this.configurarEventListeners();
        this.carregarAdSense(); // Carrega AdSense
    }

    configurarEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Sistema Furia inicializado');
        });
    }

    carregarAdSense() {
        // Script do AdSense já deve estar no HTML
        console.log('AdSense configurado para o sistema');
    }

    // =============================================
    // SISTEMA DE AUTENTICAÇÃO
    // =============================================

    fazerLogin(usuario, senha) {
        if (this.adminCredentials[usuario] && this.adminCredentials[usuario].senha === senha) {
            this.currentUser = usuario;
            this.currentRole = this.adminCredentials[usuario].nivel;
            
            localStorage.setItem('furia_user', usuario);
            localStorage.setItem('furia_role', this.currentRole);
            
            return true;
        }
        return false;
    }

    verificarAutenticacao() {
        const user = localStorage.getItem('furia_user');
        const role = localStorage.getItem('furia_role');
        
        if (user && this.adminCredentials[user]) {
            this.currentUser = user;
            this.currentRole = role;
            this.mostrarPainel();
        } else {
            this.mostrarLogin();
        }
    }

    fazerLogout() {
        localStorage.removeItem('furia_user');
        localStorage.removeItem('furia_role');
        this.currentUser = null;
        this.currentRole = null;
        this.mostrarLogin();
    }

    // =============================================
    // SISTEMA DE ARMAZENAMENTO (LocalStorage)
    // =============================================

    salvarDados() {
        const dados = {
            usuarios: this.usuarios,
            equipes: this.equipes,
            tabela: this.tabelaClassificacao,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('furia_data', JSON.stringify(dados));
    }

    carregarDados() {
        const dadosSalvos = localStorage.getItem('furia_data');
        if (dadosSalvos) {
            try {
                const dados = JSON.parse(dadosSalvos);
                this.usuarios = dados.usuarios || this.getUsuariosPadrao();
                this.equipes = dados.equipes || this.getEquipesPadrao();
                this.tabelaClassificacao = dados.tabela || this.getTabelaPadrao();
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
                this.carregarDadosPadrao();
            }
        } else {
            this.carregarDadosPadrao();
        }
    }

    carregarDadosPadrao() {
        this.usuarios = this.getUsuariosPadrao();
        this.equipes = this.getEquipesPadrao();
        this.tabelaClassificacao = this.getTabelaPadrao();
        this.salvarDados();
    }

    getUsuariosPadrao() {
        return [
            { id: 1, nome: 'FURIAGOD', tipo: 'ADM Supremo', status: 'online', pontos: 0 },
            { id: 2, nome: 'Scorpion', tipo: 'ADM Geral', status: 'online', pontos: 0 },
            { id: 3, nome: '.Son King', tipo: 'ADM Geral', status: 'online', pontos: 0 },
            { id: 4, nome: 'ToxicSkull√', tipo: 'Membro', status: 'online', pontos: 150 },
            { id: 5, nome: 'NeferpitouI', tipo: 'ADM Geral', status: 'offline', pontos: 0 },
            { id: 6, nome: 'PNTS', tipo: 'ADM Geral', status: 'offline', pontos: 0 }
        ];
    }

    getEquipesPadrao() {
        return [
            { id: 1, nome: 'FÚRIA DA NOITE', serie: 'a', pontos: 36, status: 'ativa' },
            { id: 2, nome: 'NEON ESPORTS', serie: 'a', pontos: 34, status: 'ativa' },
            { id: 3, nome: 'ECHO TEAM ACADEMY', serie: 'b', pontos: 34, status: 'ativa' },
            { id: 4, nome: 'DRAGONS ESPORTS', serie: 'c', pontos: 28, status: 'ativa' }
        ];
    }

    getTabelaPadrao() {
        return [
            { posicao: 1, equipe: 'FÚRIA DA NOITE', pontos: 36, jogos: 12, vitorias: 12, derrotas: 0 },
            { posicao: 2, equipe: 'NEON ESPORTS', pontos: 34, jogos: 12, vitorias: 11, derrotas: 1 },
            { posicao: 3, equipe: 'ECHO TEAM ACADEMY', pontos: 34, jogos: 12, vitorias: 11, derrotas: 1 },
            { posicao: 4, equipe: 'DRAGONS ESPORTS', pontos: 28, jogos: 12, vitorias: 9, derrotas: 3 }
        ];
    }

    // =============================================
    // INTERFACE DO USUÁRIO
    // =============================================

    mostrarLogin() {
        document.body.innerHTML = `
            <div class="login-container">
                <!-- ADENSE NO TOPO DO LOGIN -->
                <div class="ads-top-login">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551454046138296" crossorigin="anonymous"></script>
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-9551454046138296"
                         data-ad-slot="7259870550"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                    <script>
                         (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>
                
                <div class="login-box">
                    <h1>👑 FURIA DA NOITE PLAY</h1>
                    <h3>Painel Administrativo</h3>
                    
                    <div class="input-group">
                        <input type="text" id="loginUser" placeholder="Usuário ADM" value="FURIAGOD">
                    </div>
                    
                    <div class="input-group">
                        <input type="password" id="loginPass" placeholder="Senha" value="Furia2025_$25">
                    </div>
                    
                    <button onclick="sistema.tentarLogin()" class="login-btn">🔐 Entrar no Sistema</button>
                    
                    <button onclick="sistema.entrarComoVisitante()" class="visitante-btn">👤 Sou Visitante</button>
                    
                    <!-- ADENSE NO RODAPÉ DO LOGIN -->
                    <div class="ads-bottom-login">
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="ca-pub-9551454046138296"
                             data-ad-slot="7259870551"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                        <script>
                             (adsbygoogle = window.adsbygoogle || []).push({});
                        </script>
                    </div>
                    
                    <div class="login-info">
                        <strong>ADMs Cadastrados:</strong>
                        <div>FURIAGOD | Scorpion | .Son King</div>
                        <div>NeferpitouI | PNTS | ToxicSkull√</div>
                    </div>
                </div>
            </div>
            <style>${this.getLoginStyles()}</style>
        `;
    }

    mostrarPainel() {
        document.body.innerHTML = `
            <div class="admin-panel">
                <header class="admin-header">
                    <div class="header-left">
                        <h1>👑 FURIA DA NOITE PLAY</h1>
                        <div class="user-info">
                            Logado como: <strong>${this.currentUser}</strong> 
                            (${this.currentRole === 'supremo' ? 'ADM Supremo' : 'ADM Geral'})
                        </div>
                    </div>
                    <button onclick="sistema.fazerLogout()" class="logout-btn">🚪 Sair</button>
                </header>

                <!-- ADENSE NO HEADER -->
                <div class="ads-header">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551454046138296" crossorigin="anonymous"></script>
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-9551454046138296"
                         data-ad-slot="7259870552"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                    <script>
                         (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>

                <nav class="admin-nav">
                    <button class="nav-btn active" onclick="sistema.mostrarSecao('dashboard')">📊 Dashboard</button>
                    <button class="nav-btn" onclick="sistema.mostrarSecao('usuarios')">👥 Usuários</button>
                    <button class="nav-btn" onclick="sistema.mostrarSecao('equipes')">🏆 Equipes</button>
                    <button class="nav-btn" onclick="sistema.mostrarSecao('tabela')">📈 Tabela</button>
                    ${this.currentRole === 'supremo' ? 
                        '<button class="nav-btn" onclick="sistema.mostrarSecao(\'admins\')">⚡ ADMs</button>' : ''}
                </nav>

                <main class="admin-content">
                    <div id="dashboard" class="content-section active">
                        ${this.renderDashboard()}
                    </div>
                    <div id="usuarios" class="content-section">
                        ${this.renderUsuarios()}
                    </div>
                    <div id="equipes" class="content-section">
                        ${this.renderEquipes()}
                    </div>
                    <div id="tabela" class="content-section">
                        ${this.renderTabela()}
                    </div>
                    ${this.currentRole === 'supremo' ? `
                    <div id="admins" class="content-section">
                        ${this.renderAdmins()}
                    </div>` : ''}
                </main>

                <!-- ADENSE NO FOOTER -->
                <footer class="admin-footer">
                    <div class="ads-footer">
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551454046138296" crossorigin="anonymous"></script>
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="ca-pub-9551454046138296"
                             data-ad-slot="7259870553"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                        <script>
                             (adsbygoogle = window.adsbygoogle || []).push({});
                        </script>
                    </div>
                    <p>© 2025 FuriaDaNoitePlay - Sistema Administrativo</p>
                </footer>
            </div>
            <style>${this.getPanelStyles()}</style>
        `;
    }

    // =============================================
    // RENDERIZAÇÃO DAS SEÇÕES (COM ADSENSE)
    // =============================================

    renderDashboard() {
        const totalUsuarios = this.usuarios.length;
        const totalEquipes = this.equipes.length;
        const usuariosOnline = this.usuarios.filter(u => u.status === 'online').length;

        return `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <h3>👥 Total Usuários</h3>
                    <div class="stat-number">${totalUsuarios}</div>
                </div>
                <div class="stat-card">
                    <h3>🏆 Total Equipes</h3>
                    <div class="stat-number">${totalEquipes}</div>
                </div>
                <div class="stat-card">
                    <h3>🟢 Usuários Online</h3>
                    <div class="stat-number">${usuariosOnline}</div>
                </div>
                <div class="stat-card">
                    <h3>⚡ Campeonatos</h3>
                    <div class="stat-number">3</div>
                </div>
            </div>

            <!-- ADENSE NO MEIO DO DASHBOARD -->
            <div class="ads-dashboard">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551454046138296" crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9551454046138296"
                     data-ad-slot="7259870554"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>
                     (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>

            <div class="recent-activity">
                <h3>📋 Atividade Recente</h3>
                <div class="activity-list">
                    <div class="activity-item">✅ Sistema inicializado</div>
                    <div class="activity-item">🔧 Painel administrativo ativo</div>
                    <div class="activity-item">👤 ${this.currentUser} logado</div>
                    <div class="activity-item">💰 AdSense integrado</div>
                </div>
            </div>
        `;
    }

    renderUsuarios() {
        return `
            <div class="section-header">
                <h2>👥 Gerenciamento de Usuários</h2>
                <button onclick="sistema.adicionarUsuario()" class="btn-primary">➕ Novo Usuário</button>
            </div>

            <!-- ADENSE ANTES DA LISTA -->
            <div class="ads-content">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551454046138296" crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9551454046138296"
                     data-ad-slot="7259870555"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>
                     (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>

            <div class="search-box">
                <input type="text" id="searchUser" placeholder="🔍 Pesquisar usuário..." 
                       onkeyup="sistema.filtrarUsuarios()">
            </div>

            <div class="users-list" id="usersList">
                ${this.usuarios.map(usuario => `
                    <div class="user-card">
                        <div class="user-avatar">${usuario.nome.charAt(0)}</div>
                        <div class="user-info">
                            <div class="user-name">${usuario.nome}</div>
                            <div class="user-type ${usuario.tipo.includes('ADM') ? 'adm-type' : 'member-type'}">
                                ${usuario.tipo}
                            </div>
                            <div class="user-status ${usuario.status}">
                                ${usuario.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                            </div>
                        </div>
                        <div class="user-actions">
                            ${usuario.tipo.includes('ADM') ? `
                                <button onclick="sistema.editarUsuario(${usuario.id})" class="btn-warning">✏️</button>
                            ` : `
                                <button onclick="sistema.promoverUsuario(${usuario.id})" class="btn-success">⬆️</button>
                                <button onclick="sistema.banirUsuario(${usuario.id})" class="btn-danger">🚫</button>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEquipes() {
        return `
            <div class="section-header">
                <h2>🏆 Gerenciamento de Equipes</h2>
                <button onclick="sistema.criarEquipe()" class="btn-primary">➕ Nova Equipe</button>
            </div>

            <!-- ADENSE VERTICAL NAS EQUIPES -->
            <div class="ads-vertical">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551454046138296" crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9551454046138296"
                     data-ad-slot="7259870556"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>
                     (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>

            <div class="series-filter">
                <select onchange="sistema.filtrarEquipes()" id="seriesSelect">
                    <option value="todas">Todas as Séries</option>
                    <option value="a">Série A</option>
                    <option value="b">Série B</option>
                    <option value="c">Série C</option>
                </select>
            </div>

            <div class="teams-grid">
                ${this.equipes.map(equipe => `
                    <div class="team-card">
                        <div class="team-header">
                            <div class="team-avatar">${equipe.nome.substring(0, 2)}</div>
                            <div class="team-name">${equipe.nome}</div>
                        </div>
                        <div class="team-info">
                            <div class="team-series">Série ${equipe.serie.toUpperCase()}</div>
                            <div class="team-points">${equipe.pontos} pontos</div>
                        </div>
                        <div class="team-actions">
                            <button onclick="sistema.editarEquipe(${equipe.id})" class="btn-warning">✏️</button>
                            <button onclick="sistema.transferirEquipe(${equipe.id})" class="btn-primary">🔄</button>
                            <button onclick="sistema.removerEquipe(${equipe.id})" class="btn-danger">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTabela() {
        return `
            <div class="section-header">
                <h2>📈 Tabela de Classificação</h2>
                <button onclick="sistema.atualizarTabela()" class="btn-primary">🔄 Atualizar</button>
            </div>

            <!-- ADENSE NA TABELA -->
            <div class="ads-responsive">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551454046138296" crossorigin="anonymous"></script>
 