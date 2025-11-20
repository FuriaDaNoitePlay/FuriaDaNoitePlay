<?php
// furia_busca.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// =============================================
// SISTEMA DE BUSCA FURIA DA NOITE
// =============================================

class FuriaBusca {
    private $dataDir = 'data/';
    
    public function __construct() {
        $this->verificarArquivos();
    }
    
    private function verificarArquivos() {
        $arquivos = [
            'furia_usuarios.json',
            'furia_equipes.json', 
            'furia_admins.json'
        ];
        
        foreach ($arquivos as $arquivo) {
            if (!file_exists($this->dataDir . $arquivo)) {
                $this->criarArquivoPadrao($arquivo);
            }
        }
    }
    
    private function criarArquivoPadrao($arquivo) {
        $dadosPadrao = [];
        
        switch($arquivo) {
            case 'furia_admins.json':
                $dadosPadrao = [
                    [
                        'id' => 1,
                        'username' => 'FURIAGOD',
                        'nivel' => 'supremo',
                        'status' => 'ativo',
                        'data_cadastro' => date('Y-m-d H:i:s')
                    ],
                    [
                        'id' => 2,
                        'username' => 'Scorpion',
                        'nivel' => 'geral',
                        'status' => 'ativo',
                        'data_cadastro' => date('Y-m-d H:i:s')
                    ]
                ];
                break;
                
            case 'furia_equipes.json':
                $dadosPadrao = [
                    [
                        'id' => 1,
                        'nome_equipe' => 'Furia Principal',
                        'tag_equipe' => 'FURIA',
                        'membros' => ['FURIAGOD', 'Scorpion'],
                        'status' => 'ativa',
                        'data_criacao' => date('Y-m-d H:i:s')
                    ]
                ];
                break;
                
            case 'furia_usuarios.json':
                $dadosPadrao = [
                    [
                        'id' => 1,
                        'nick' => 'FURIAGOD',
                        'nivel' => 'supremo',
                        'status' => 'ativo',
                        'equipe' => 'Furia Principal',
                        'data_cadastro' => date('Y-m-d H:i:s')
                    ]
                ];
                break;
        }
        
        file_put_contents($this->dataDir . $arquivo, json_encode($dadosPadrao, JSON_PRETTY_PRINT));
    }
    
    // =============================================
    // SISTEMA DE BUSCA
    // =============================================
    
    public function buscarEquipes($termo = '') {
        $equipes = json_decode(file_get_contents($this->dataDir . 'furia_equipes.json'), true);
        
        if (empty($termo)) {
            return $equipes;
        }
        
        $resultados = [];
        foreach ($equipes as $equipe) {
            if (stripos($equipe['nome_equipe'], $termo) !== false || 
                stripos($equipe['tag_equipe'], $termo) !== false) {
                $resultados[] = $equipe;
            }
        }
        
        return $resultados;
    }
    
    public function buscarMembros($termo = '') {
        $usuarios = json_decode(file_get_contents($this->dataDir . 'furia_usuarios.json'), true);
        
        if (empty($termo)) {
            return $usuarios;
        }
        
        $resultados = [];
        foreach ($usuarios as $usuario) {
            if (stripos($usuario['nick'], $termo) !== false || 
                stripos($usuario['equipe'], $termo) !== false ||
                stripos($usuario['nivel'], $termo) !== false) {
                $resultados[] = $usuario;
            }
        }
        
        return $resultados;
    }
    
    public function buscarAdmins($termo = '') {
        $admins = json_decode(file_get_contents($this->dataDir . 'furia_admins.json'), true);
        
        if (empty($termo)) {
            return $admins;
        }
        
        $resultados = [];
        foreach ($admins as $admin) {
            if (stripos($admin['username'], $termo) !== false || 
                stripos($admin['nivel'], $termo) !== false) {
                $resultados[] = $admin;
            }
        }
        
        return $resultados;
    }
    
    public function buscarEquipeAtual($usuario = '') {
        $usuarios = json_decode(file_get_contents($this->dataDir . 'furia_usuarios.json'), true);
        
        foreach ($usuarios as $user) {
            if ($user['nick'] === $usuario) {
                return $user['equipe'] ?? 'Sem equipe';
            }
        }
        
        return 'Usuário não encontrado';
    }
    
    public function buscarMembroAtual($usuario = '') {
        $usuarios = json_decode(file_get_contents($this->dataDir . 'furia_usuarios.json'), true);
        
        foreach ($usuarios as $user) {
            if ($user['nick'] === $usuario) {
                return $user;
            }
        }
        
        return null;
    }
    
    public function buscarAdminAtual($usuario = '') {
        $admins = json_decode(file_get_contents($this->dataDir . 'furia_admins.json'), true);
        
        foreach ($admins as $admin) {
            if ($admin['username'] === $usuario) {
                return $admin;
            }
        }
        
        return null;
    }
}

// =============================================
// PROCESSAR REQUISIÇÕES
// =============================================

$busca = new FuriaBusca();
$acao = $_POST['acao'] ?? $_GET['acao'] ?? '';
$termo = $_POST['termo'] ?? $_GET['termo'] ?? '';
$usuario = $_POST['usuario'] ?? $_GET['usuario'] ?? '';

switch($acao) {
    case 'buscar_equipes':
        $resultado = $busca->buscarEquipes($termo);
        echo json_encode(['success' => true, 'equipes' => $resultado]);
        break;
        
    case 'buscar_membros':
        $resultado = $busca->buscarMembros($termo);
        echo json_encode(['success' => true, 'membros' => $resultado]);
        break;
        
    case 'buscar_admins':
        $resultado = $busca->buscarAdmins($termo);
        echo json_encode(['success' => true, 'admins' => $resultado]);
        break;
        
    case 'equipe_atual':
        $resultado = $busca->buscarEquipeAtual($usuario);
        echo json_encode(['success' => true, 'equipe_atual' => $resultado]);
        break;
        
    case 'membro_atual':
        $resultado = $busca->buscarMembroAtual($usuario);
        echo json_encode(['success' => true, 'membro_atual' => $resultado]);
        break;
        
    case 'admin_atual':
        $resultado = $busca->buscarAdminAtual($usuario);
        echo json_encode(['success' => true, 'admin_atual' => $resultado]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Ação não especificada']);
}
?>
