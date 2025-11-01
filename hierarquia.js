// ===============================================================
// SISTEMA DE HIERARQUIA - FURIA DA NOITE PLAY
// ===============================================================

class SistemaHierarquia {
    constructor() {
        this.hierarquia = {
            'dono': {
                nivel: 5,
                nome: 'Dono',
                cor: '#ff0000',
                permissoes: ['tudo']
            },
            'lider': {
                nivel: 4,
                nome: 'Líder',
                cor: '#ff4500',
                permissoes: ['gerenciar_equipes', 'gerenciar_membros', 'ver_relatorios']
            },
            'colider': {
                nivel: 3,
                nome: 'Colíder',
                cor: '#ffa500',
                permissoes: ['gerenciar_membros', 'ver_relatorios']
            },
            'veterano': {
                nivel: 2,
                nome: 'Veterano',
                cor: '#ffff00',
                permissoes: ['ver_relatorios']
            },
            'anciao': {
                nivel: 1,
                nome: 'Ancião',
                cor: '#00ff00',
                permissoes: ['acesso_basico']
            }
        };
    }

    getNivel(nivel) {
        return Object.values(this.hierarquia).find(h => h.nivel === nivel);
    }

    getPermissoes(nivel) {
        const hierarquia = this.getNivel(nivel);
        return hierarquia ? hierarquia.permissoes : [];
    }

    podeAcessar(nivelUsuario, recurso) {
        const permissoes = this.getPermissoes(nivelUsuario);
        return permissoes.includes('tudo') || permissoes.includes(recurso);
    }

    // Gera badge visual para a hierarquia
    gerarBadge(nivel) {
        const hierarquia = this.getNivel(nivel);
        if (!hierarquia) return '';

        return `
            <span class="badge-hierarquia" style="
                background: ${hierarquia.cor};
                color: #000;
                padding: 5px 10px;
                border-radius: 15px;
                font-weight: bold;
                text-shadow: 0 0 5px #fff;
                box-shadow: 0 0 10px ${hierarquia.cor};
            ">
                ${hierarquia.nome}
            </span>
        `;
    }
}

// Instância global do sistema
const sistemaHierarquia = new SistemaHierarquia();