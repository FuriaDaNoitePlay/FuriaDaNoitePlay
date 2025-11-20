<?php
// =============================================
// CONFIG.PHP - SISTEMA DE CONFIGURAÇÃO FURIA DA NOITE
// Sistema de arquivos JSON - Compatível com todo o sistema
// =============================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configuração de timezone
date_default_timezone_set('America/Sao_Paulo');

// =============================================
// CLASSE PRINCIPAL DE CONFIGURAÇÃO
// =============================================

class FuriaConfig {
    private $dataDir = 'data/';
    private $backupDir = 'backups/';
    
    // Credenciais dos ADMs (mantendo compatibilidade)
    private $adminCredentials = [
        'FURIAGOD' => 'Furia2025_$25',
        'Scorpion' => 'Mlk0025',
        '.Son King' => 'God1925',
        'NeferpitouI' => 'Ana02525',
        'PNTS' => 'pNtS25',
        'ToxicSkull√' => 'L@!on25'
    ];
    
    public function __construct() {
        $this->inicializarDiretorios();
        $this->criarArquivosPadrao();
    }
    
    // =============================================
    // INICIALIZAÇÃO DO SISTEMA
    // =============================================
    
    private function inicializarDiretorios() {
        // Criar diretórios se não existirem
        $diretorios = [$this->dataDir, $this->backupDir];
        
        foreach ($diretorios as $dir) {
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
                file_put_contents($dir . '.htaccess', 'Deny from all');
            }
        }
    }
    
    private function criarArquivosPadrao() {
        $arquivos = [
            'usuarios' => [],
            'equipes' => [],
            'ranking' => [],
            'config' => [
                'sistema' => 'FuriaDaNoitePlay',
                'versao' => '2.0',
                'data_instalacao' => date('Y-m-d H:i:s'),
                'ultimo_backup' => null,
                'estatisticas' => [
                    'total_usuarios' => 0,
                    'total_equipes' => 0,
                    'total_partidas' => 0,
                    'usuarios_online' => 0
                ]
            ],
            'logs' => []
        ];
        
        foreach ($arquivos as $tipo => $dadosPadrao) {
            $caminhoArquivo = $this->getFilePath($tipo);
            if (!file_exists($caminhoArquivo)) {
                $this->salvarDados($tipo, $dadosPadrao);
            }
        }
    }
    
    // =============================================
    // GERENCIAMENTO DE ARQUIVOS
    // =============================================
    
    public function getFilePath($tipo) {
        $arquivos = [
            'usuarios' => $this->dataDir . 'furia_usuarios.json',
            'equipes' => $this->dataDir . 'furia_equipes.json',
            'ranking' => $this->dataDir . 'furia_ranking.json',
            'config' => $this->dataDir . 'furia_config.json',
            'logs' => $this->dataDir . 'furia_logs.json',
            'backup' => $this->backupDir . 'backup_' . date('Y-m-d_H-i-s') . '.json'
        ];
        
        return $arquivos[$tipo] ?? null;
    }
    
    public function lerDados($tipo) {
        $arquivo = $this->getFilePath($tipo);
        
        if (!file_exists($arquivo)) {
            return [];
        }
        
        try {
            $conteudo = file_get_contents($arquivo);
            $dados = json_decode($conteudo, true);
            return $dados ?: [];
        } catch (Exception $e) {
            $this->registrarLog("ERRO_LER_ARQUIVO", "Falha ao ler {$tipo}: " . $e->getMessage());
            return [];
        }
    }
    
    public function salvarDados($tipo, $dados) {
        $arquivo = $this->getFilePath($tipo);
        
        try {
            $json = json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            $resultado = file_put_contents($arquivo, $json);
            
            if ($resultado !== false) {
                $this->registrarLog("ARQUIVO_SALVO", "Dados salvos em {$tipo}");
                return true;
            } else {
                throw new Exception("Falha ao escrever no arquivo");
            }
        } catch (Exception $e) {
            $this->registrarLog("ERRO_SALVAR_ARQUIVO", "Falha ao salvar {$tipo}: " . $e->getMessage());
            return false;
        }
    }
    
    // =============================================
    // SISTEMA DE LOGS
    // =============================================
    
    public function registrarLog($acao, $detalhes, $usuario = 'Sistema') {
        $log = [
            'timestamp' => date('Y-m-d H:i:s'),
            'acao' => $acao,
            'detalhes' => $detalhes,
            'usuario' => $usuario,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Desconhecido'
        ];
        
        // Salvar em arquivo de texto para fácil leitura
        $logTexto = "[" . $log['timestamp'] . "] {$log['acao']} - {$log['detalhes']} (Por: {$log['usuario']})\n";
        file_put_contents('sistema_log.txt', $logTexto, FILE_APPEND | LOCK_EX);
        
        // Também salvar em JSON para análise
        $logs = $this->lerDados('logs');
        $logs[] = $log;
        
        // Manter apenas os últimos 1000 logs
        if (count($logs) > 1000) {
            $logs = array_slice($logs, -1000);
        }
        
        $this->salvarDados('logs', $logs);
    }
    
    // =============================================
    // BACKUP E RESTAURAÇÃO
    // =============================================
    
    public function criarBackup() {
        try {
            $backup = [
                'timestamp' => date('Y-m-d H:i:s'),
                'dados' => [
                    'usuarios' => $this->lerDados('usuarios'),
                    'equipes' => $this->lerDados('equipes'),
                    'ranking' => $this->lerDados('ranking'),
                    'config' => $this->lerDados('config')
                ]
            ];
            
            $arquivoBackup = $this->getFilePath('backup');
            file_put_contents($arquivoBackup, json_encode($backup, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            
            // Atualizar data do último backup
            $config = $this->lerDados('config');
            $config['ultimo_backup'] = date('Y-m-d H:i:s');
            $this->salvarDados('config', $config);
            
            $this->registrarLog("BACKUP_CRIADO", "Backup criado com sucesso");
            return true;
        } catch (Exception $e) {
            $this->registrarLog("ERRO_BACKUP", "Falha ao criar backup: " . $e->getMessage());
            return false;
        }
    }
    
    // =============================================
    // ESTATÍSTICAS DO SISTEMA
    // =============================================
    
    public function atualizarEstatisticas() {
        $usuarios = $this->lerDados('usuarios');
        $equipes = $this->lerDados('equipes');
        
        $config = $this->lerDados('config');
        $config['estatisticas'] = [
            'total_usuarios' => count($usuarios),
            'total_equipes' => count($equipes),
            'total_partidas' => 0, // Pode ser calculado depois
            'usuarios_online' => 0, // Pode ser implementado depois
            'ultima_atualizacao' => date('Y-m-d H:i:s')
        ];
        
        $this->salvarDados('config', $config);
        return $config['estatisticas'];
    }
    
    public function getEstatisticas() {
        $config = $this->lerDados('config');
        return $config['estatisticas'] ?? [];
    }
    
    // =============================================
    // VALIDAÇÃO DE CREDENCIAIS
    // =============================================
    
    public function validarAdmin($usuario, $senha) {
        if (isset($this->adminCredentials[$usuario]) && $this->adminCredentials[$usuario] === $senha) {
            $this->registrarLog("LOGIN_ADM", "Login bem-sucedido", $usuario);
            return [
                'success' => true,
                'usuario' => $usuario,
                'nivel' => ($usuario === 'FURIAGOD') ? 'supremo' : 'geral',
                'tipo' => 'adm'
            ];
        }
        
        $this->registrarLog("LOGIN_FALHA", "Tentativa de login inválida", $usuario);
        return ['success' => false];
    }
    
    public function validarMembro($nick, $senha) {
        $usuarios = $this->lerDados('usuarios');
        
        foreach ($usuarios as $usuario) {
            if ($usuario['nick'] === $nick && $usuario['senha'] === $senha) {
                $this->registrarLog("LOGIN_MEMBRO", "Login bem-sucedido", $nick);
                return [
                    'success' => true,
                    'usuario' => $usuario,
                    'tipo' => 'membro'
                ];
            }
        }
        
        $this->registrarLog("LOGIN_FALHA", "Tentativa de login de membro inválida", $nick);
        return ['success' => false];
    }
    
    public function validarEquipe($nomeEquipe, $senha) {
        $equipes = $this->lerDados('equipes');
        
        foreach ($equipes as $equipe) {
            if ($equipe['nome_equipe'] === $nomeEquipe && $equipe['senha'] === $senha) {
                $this->registrarLog("LOGIN_EQUIPE", "Login bem-sucedido", $nomeEquipe);
                return [
                    'success' => true,
                    'usuario' => $equipe,
                    'tipo' => 'equipe'
                ];
            }
        }
        
        $this->registrarLog("LOGIN_FALHA", "Tentativa de login de equipe inválida", $nomeEquipe);
        return ['success' => false];
    }
    
    // =============================================
    // INFORMAÇÕES DO SISTEMA
    // =============================================
    
    public function getInfoSistema() {
        $config = $this->lerDados('config');
        $estatisticas = $this->getEstatisticas();
        
        return [
            'sistema' => 'FuriaDaNoitePlay',
            'versao' => $config['versao'] ?? '2.0',
            'data_instalacao' => $config['data_instalacao'] ?? date('Y-m-d H:i:s'),
            'ultimo_backup' => $config['ultimo_backup'] ?? 'Nunca',
            'estatisticas' => $estatisticas,
            'status' => 'operacional',
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}

// =============================================
// INICIALIZAÇÃO E FUNÇÕES GLOBAIS
// =============================================

// Criar instância global
$furiaConfig = new FuriaConfig();

// Função helper para resposta JSON
function enviarResposta($dados, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

// Processar requisição OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// =============================================
// ROTAS DA API
// =============================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $acao = $_GET['acao'] ?? '';
    
    switch($acao) {
        case 'info':
            enviarResposta($furiaConfig->getInfoSistema());
            break;
            
        case 'estatisticas':
            $estatisticas = $furiaConfig->atualizarEstatisticas();
            enviarResposta(['success' => true, 'estatisticas' => $estatisticas]);
            break;
            
        case 'backup':
            $resultado = $furiaConfig->criarBackup();
            enviarResposta(['success' => $resultado, 'mensagem' => $resultado ? 'Backup criado' : 'Erro no backup']);
            break;
            
        default:
            enviarResposta($furiaConfig->getInfoSistema());
    }
}

// Se acessado diretamente, mostrar informações
if (!isset($_GET['acao']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
?>
<!DOCTYPE html>
<html>
<head>
    <title>Configuração - FuriaDaNoite</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f0f0f0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .erro { background: #ffe8e8; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚙️ Sistema de Configuração</h1>
        <div class="info">
            <h3>FuriaDaNoitePlay - Backend Config</h3>
            <p><strong>Status:</strong> ✅ Operacional</p>
            <p><strong>Sistema:</strong> Arquivos JSON</p>
            <p><strong>Data:</strong> <?php echo date('d/m/Y H:i:s'); ?></p>
        </div>
        <p>Este arquivo gerencia toda a configuração do sistema FuriaDaNoite.</p>
    </div>
</body>
</html>
<?php
}
?>
