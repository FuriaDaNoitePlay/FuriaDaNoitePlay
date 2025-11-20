// furia_busca.js
class FuriaBuscaSystem {
    constructor() {
        this.baseURL = 'furia_busca.php';
        this.init();
    }

    init() {
        console.log('🔍 Sistema de Busca Furia inicializado');
        this.configurarEventListeners();
    }

    // =============================================
    // MÉTODOS DE BUSCA
    // =============================================

    async buscarEquipes(termo = '') {
        try {
            const formData = new FormData();
            formData.append('acao', 'buscar_equipes');
            formData.append('termo', termo);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();
            return resultado;
        } catch (error) {
            console.error('❌ Erro ao buscar equipes:', error);
            return this.buscarEquipesLocal(termo);
        }
    }

    async buscarMembros(termo = '') {
        try {
            const formData = new FormData();
            formData.append('acao', 'buscar_membros');
            formData.append('termo', termo);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();
            return resultado;
        } catch (error) {
            console.error('❌ Erro ao buscar membros:', error);
            return this.buscarMembrosLocal(termo);
        }
    }

    async buscarAdmins(termo = '') {
        try {
            const formData = new FormData();
            formData.append('acao', 'buscar_admins');
            formData.append('termo', termo);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();
            return resultado;
        } catch (error) {
            console.error('❌ Erro ao buscar admins:', error);
            return this.buscarAdminsLocal(termo);
        }
    }

    async buscarEquipeAtual(usuario) {
        try {
            const formData = new FormData();
            formData.append('acao', 'equipe_atual');
            formData.append('usuario', usuario);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();
            return resultado;
        } catch (error) {
            console.error('❌ Erro ao buscar equipe atual:', error);
            return this.buscarEquipeAtualLocal(usuario);
        }
    }

    async buscarMembroAtual(usuario) {
        try {
            const formData = new FormData();
            formData.append('acao', 'membro_atual');
            formData.append('usuario', usuario);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();
            return resultado;
        } catch (error) {
            console.error('❌ Erro ao buscar membro atual:', error);
            return this.buscarMembroAtualLocal(usuario);
        }
    }

    async buscarAdminAtual(usuario) {
        try {
            const formData = new FormData();
            formData.append('acao', 'admin_atual');
            formData.append('usuario', usuario);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();
            return resultado;
        } catch (error) {
            console.error('❌ Erro ao buscar admin atual:', error);
            return this.buscarAdminAtualLocal(usuario);
        }
    }

    // =============================================
    // FALLBACK LOCAL
    // =============================================

    buscarEquipesLocal(termo = '') {
        const equipes = JSON.parse(localStorage.getItem('furia_equipes')) || [];
        
        if (!termo) {
            return { success: true, equipes };
        }

        const resultados = equipes.filter(equipe => 
            equipe.nome_equipe.toLowerCase().includes(termo.toLowerCase()) ||
            equipe.tag_equipe.toLowerCase().includes(termo.toLowerCase())
        );

        return { success: true, equipes: resultados };
    }

    buscarMembrosLocal(termo = '') {
        const usuarios = JSON.parse(localStorage.getItem('furia_usuarios')) || [];
        
        if (!termo) {
            return { success: true, membros: usuarios };
        }

        const resultados = usuarios.filter(usuario =>
            usuario.nick.toLowerCase().includes(termo.toLowerCase()) ||
            (usuario.equipe && usuario.equipe.toLowerCase().includes(termo.toLowerCase()))
        );

        return { success: true, membros: resultados };
    }

    buscarAdminsLocal(termo = '') {
        const admins = [
            { username: 'FURIAGOD', nivel: 'supremo', status: 'ativo' },
            { username: 'Scorpion', nivel: 'geral', status: 'ativo' },
            { username: '.Son King', nivel: 'geral', status: 'ativo' },
            { username: 'NeferpitouI', nivel: 'geral', status: 'ativo' },
            { username: 'PNTS', nivel: 'geral', status: 'ativo' },
            { username: 'ToxicSkull√', nivel: 'geral', status: 'ativo' }
        ];

        if (!termo) {
            return { success: true, admins };
        }

        const resultados = admins.filter(admin =>
            admin.username.toLowerCase().includes(termo.toLowerCase()) ||
            admin.nivel.toLowerCase().includes(termo.toLowerCase())
        );

        return { success: true, admins: resultados };
    }

    buscarEquipeAtualLocal(usuario) {
        const usuarios = JSON.parse(localStorage.getItem('furia_usuarios')) || [];
        const usuarioEncontrado = usuarios.find(u => u.nick === usuario);
        
        return { 
            success: true, 
            equipe_atual: usuarioEncontrado?.equipe || 'Sem equipe' 
        };
    }

    buscarMembroAtualLocal(usuario) {
        const usuarios = JSON.parse(localStorage.getItem('furia_usuarios')) || [];
        const usuarioEncontrado = usuarios.find(u => u.nick === usuario);
        
        return { 
            success: true, 
            membro_atual: usuarioEncontrado || null 
        };
    }

    buscarAdminAtualLocal(usuario) {
        const admins = [
            { username: 'FURIAGOD', nivel: 'supremo', status: 'ativo' },
            { username: 'Scorpion', nivel: 'geral', status: 'ativo' },
            { username: '.Son King', nivel: 'geral', status: 'ativo' },
            { username: 'NeferpitouI', nivel: 'geral', status: 'ativo' },
            { username: 'PNTS', nivel: 'geral', status: 'ativo' },
            { username: 'ToxicSkull√', nivel: 'geral', status: 'ativo' }
        ];

        const adminEncontrado = admins.find(a => a.username === usuario);
        
        return { 
            success: true, 
            admin_atual: adminEncontrado || null 
        };
    }

    // =============================================
    // INTERFACE DE BUSCA
    // =============================================

    configurarEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Configurar busca em tempo real
            const buscaInputs = document.querySelectorAll('.furia-busca-input');
            buscaInputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    this.buscaEmTempoReal(e.target);
                });
            });

            // Configurar botões de busca
            const buscaBotoes = document.querySelectorAll('.furia-busca-btn');
            buscaBotoes.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.executarBusca(e.target);
                });
            });
        });
    }

    async buscaEmTempoReal(input) {
        const tipo = input.dataset.tipo;
        const termo = input.value;
        
        if (termo.length < 2) {
            this.limparResultados(input);
            return;
        }

        let resultados;
        switch(tipo) {
            case 'equipes':
                resultados = await this.buscarEquipes(termo);
                break;
            case 'membros':
                resultados = await this.buscarMembros(termo);
                break;
            case 'admins':
                resultados = await this.buscarAdmins(termo);
                break;
        }

        this.mostrarResultados(input, resultados);
    }

    mostrarResultados(input, resultados) {
        this.limparResultados(input);
        
        const container = document.createElement('div');
        container.className = 'furia-resultados-busca';
        container.style.cssText = `
            position: absolute;
            background: #1a1a2e;
            border: 1px solid #00ff88;
            border-radius: 5px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            width: 100%;
            margin-top: 5px;
        `;

        const dados = resultados.equipes || resultados.membros || resultados.admins || [];
        
        dados.forEach(item => {
            const elemento = document.createElement('div');
            elemento.className = 'furia-item-busca';
            elemento.style.cssText = `
                padding: 10px;
                border-bottom: 1px solid #333;
                cursor: pointer;
                color: white;
            `;
            elemento.textContent = item.nome_equipe || item.nick || item.username;
            elemento.addEventListener('click', () => {
                input.value = item.nome_equipe || item.nick || item.username;
                this.limparResultados(input);
            });
            container.appendChild(elemento);
        });

        input.parentNode.appendChild(container);
    }

    limparResultados(input) {
        const resultados = input.parentNode.querySelector('.furia-resultados-busca');
        if (resultados) {
            resultados.remove();
        }
    }

    // =============================================
    // UTILITÁRIOS
    // =============================================

    criarInterfaceBusca(containerId, tipo) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="furia-busca-container">
                <input type="text" class="furia-busca-input" data-tipo="${tipo}" 
                       placeholder="Buscar ${tipo}...">
                <button class="furia-busca-btn" data-tipo="${tipo}">🔍</button>
                <div class="furia-resultados-container"></div>
            </div>
        `;
    }
}

// =============================================
// INICIALIZAÇÃO GLOBAL
// =============================================

const furiaBusca = new FuriaBuscaSystem();
window.furiaBusca = furiaBusca;

// Funções globais para uso direto no HTML
function buscarEquipes(termo = '') {
    return furiaBusca.buscarEquipes(termo);
}

function buscarMembros(termo = '') {
    return furiaBusca.buscarMembros(termo);
}

function buscarAdmins(termo = '') {
    return furiaBusca.buscarAdmins(termo);
}

function buscarEquipeAtual(usuario) {
    return furiaBusca.buscarEquipeAtual(usuario);
}

function buscarMembroAtual(usuario) {
    return furiaBusca.buscarMembroAtual(usuario);
}

function buscarAdminAtual(usuario) {
    return furiaBusca.buscarAdminAtual(usuario);
}
