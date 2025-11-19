<?php
// =============================================
// CADASTRO.PHP - SISTEMA DE CADASTRO FURIA DA NOITE
// =============================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configuração de timezone
date_default_timezone_set('America/Sao_Paulo');

// Arquivos JSON
$arquivo_usuarios = 'data/furia_usuarios.json';
$arquivo_equipes = 'data/furia_equipes.json';
$arquivo_ranking = 'data/furia_ranking.json';

// Criar diretório data se não existir
if (!is_dir('data')) {
    mkdir('data', 0777, true);
}

// Criar arquivos se não existirem
if (!file_exists($arquivo_usuarios)) {
    file_put_contents($arquivo_usuarios, json_encode([]));
}
if (!file_exists($arquivo_equipes)) {
    file_put_contents($arquivo_equipes, json_encode([]));
}
if (!file_exists($arquivo_ranking)) {
    file_put_contents($arquivo_ranking, json_encode([]));
}

// Função para ler dados JSON
function lerDados($arquivo) {
    if (!file_exists($arquivo)) {
        return [];
    }
    $dados = file_get_contents($arquivo);
    return json_decode($dados, true) ?: [];
}

// Função para salvar dados JSON
function salvarDados($arquivo, $dados) {
    return file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Função para registrar log
function registrarLog($mensagem) {
    $log = date('Y-m-d H:i:s') . " - " . $mensagem . "\n";
    file_put_contents('cadastro_log.txt', $log, FILE_APPEND | LOCK_EX);
}

// Processar requisição OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Processar requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipo = $_POST['tipo'] ?? '';
    
    $resposta = ['success' => false, 'message' => ''];
    
    try {
        switch($tipo) {
            case 'membro':
                // Cadastro de membro
                $nick = trim($_POST['nick'] ?? '');
                $senha = trim($_POST['senha'] ?? '');
                $whatsapp = trim($_POST['whatsapp'] ?? '');
                $jogo = $_POST['jogo'] ?? '';
                $id_jogo = trim($_POST['id_jogo'] ?? '');
                
                if (empty($nick) || empty($senha) || empty($whatsapp) || empty($jogo) || empty($id_jogo)) {
                    throw new Exception('❌ Preencha todos os campos obrigatórios!');
                }
                
                // Validar WhatsApp
                if (!preg_match('/^\(\d{2}\)\s9\d{4}-\d{4}$/', $whatsapp)) {
                    throw new Exception('❌ Formato de WhatsApp inválido! Use: (31) 99999-9999');
                }
                
                // Validar ID do jogo
                if (!preg_match('/^\d{9,12}$/', $id_jogo)) {
                    throw new Exception('❌ ID do jogo deve ter entre 9 e 12 dígitos!');
                }
                
                $usuarios = lerDados($arquivo_usuarios);
                
                // Verificar se usuário já existe
                foreach ($usuarios as $usuario) {
                    if ($usuario['nick'] === $nick) {
                        throw new Exception('❌ Este nickname já está em uso!');
                    }
                }
                
                // Criar novo usuário
                $novoUsuario = [
                    'id' => 'user_' . time() . '_' . uniqid(),
                    'nick' => $nick,
                    'senha' => $senha, // Em produção, usar password_hash()
                    'whatsapp' => $whatsapp,
                    'jogo' => $jogo,
                    'id_jogo' => $id_jogo,
                    'tipo' => 'membro',
                    'data_cadastro' => date('d/m/Y H:i:s'),
                    'status' => 'ativo',
                    'pontuacao' => 0,
                    'vitorias' => 0,
                    'derrotas' => 0
                ];
                
                $usuarios[] = $novoUsuario;
                
                if (salvarDados($arquivo_usuarios, $usuarios)) {
                    $resposta['success'] = true;
                    $resposta['message'] = '✅ Membro cadastrado com sucesso!';
                    registrarLog("Novo membro: {$nick}");
                    
                    // Adicionar ao ranking também
                    $ranking = lerDados($arquivo_ranking);
                    $ranking[] = [
                        'id' => $novoUsuario['id'],
                        'nome' => $nick,
                        'tipo' => 'usuario',
                        'jogo' => $jogo,
                        'pontuacao' => 0,
                        'vitorias' => 0,
                        'derrotas' => 0,
                        'posicao' => count($ranking) + 1,
                        'data_entrada' => date('d/m/Y H:i:s'),
                        'ultima_atualizacao' => date('d/m/Y H:i:s')
                    ];
                    salvarDados($arquivo_ranking, $ranking);
                } else {
                    throw new Exception('❌ Erro ao salvar dados do usuário');
                }
                break;
                
            case 'equipe':
                // Cadastro de equipe
                $nome_equipe = trim($_POST['nome_equipe'] ?? '');
                $senha = trim($_POST['senha'] ?? '');
                $nick_lider = trim($_POST['nick_lider'] ?? '');
                $whatsapp = trim($_POST['whatsapp'] ?? '');
                $jogo = $_POST['jogo'] ?? '';
                
                if (empty($nome_equipe) || empty($senha) || empty($nick_lider) || empty($whatsapp) || empty($jogo)) {
                    throw new Exception('❌ Preencha todos os campos obrigatórios!');
                }
                
                // Validar WhatsApp
                if (!preg_match('/^\(\d{2}\)\s9\d{4}-\d{4}$/', $whatsapp)) {
                    throw new Exception('❌ Formato de WhatsApp inválido! Use: (31) 99999-9999');
                }
                
                $equipes = lerDados($arquivo_equipes);
                
                // Verificar se equipe já existe
                foreach ($equipes as $equipe) {
                    if ($equipe['nome_equipe'] === $nome_equipe) {
                        throw new Exception('❌ Este nome de equipe já está em uso!');
                    }
                }
                
                // Criar nova equipe
                $novaEquipe = [
                    'id' => 'team_' . time() . '_' . uniqid(),
                    'nome_equipe' => $nome_equipe,
                    'senha' => $senha, // Em produção, usar password_hash()
                    'nick_lider' => $nick_lider,
                    'whatsapp' => $whatsapp,
                    'jogo' => $jogo,
                    'tipo' => 'equipe',
                    'data_criacao' => date('d/m/Y H:i:s'),
                    'status' => 'ativa',
                    'pontuacao' => 0,
                    'vitorias' => 0,
                    'derrotas' => 0,
                    'membros' => [$nick_lider]
                ];
                
                $equipes[] = $novaEquipe;
                
                if (salvarDados($arquivo_equipes, $equipes)) {
                    $resposta['success'] = true;
                    $resposta['message'] = '✅ Equipe cadastrada com sucesso!';
                    registrarLog("Nova equipe: {$nome_equipe}");
                    
                    // Adicionar ao ranking também
                    $ranking = lerDados($arquivo_ranking);
                    $ranking[] = [
                        'id' => $novaEquipe['id'],
                        'nome' => $nome_equipe,
                        'tipo' => 'equipe',
                        'jogo' => $jogo,
                        'pontuacao' => 0,
                        'vitorias' => 0,
                        'derrotas' => 0,
                        'posicao' => count($ranking) + 1,
                        'data_entrada' => date('d/m/Y H:i:s'),
                        'ultima_atualizacao' => date('d/m/Y H:i:s')
                    ];
                    salvarDados($arquivo_ranking, $ranking);
                } else {
                    throw new Exception('❌ Erro ao salvar dados da equipe');
                }
                break;
                
            default:
                throw new Exception('❌ Tipo de cadastro inválido!');
        }
        
    } catch (Exception $e) {
        $resposta['message'] = $e->getMessage();
        registrarLog("Erro no cadastro: " . $e->getMessage());
    }
    
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

// Se acessado via GET, mostrar estatísticas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $usuarios = lerDados($arquivo_usuarios);
    $equipes = lerDados($arquivo_equipes);
    
    $estatisticas = [
        'success' => true,
        'sistema' => 'FuriaDaNoitePlay - Cadastro',
        'status' => 'operacional',
        'total_usuarios' => count($usuarios),
        'total_equipes' => count($equipes),
        'cadastros_hoje' => 0, // Poderia implementar contagem por data
        'ultima_atualizacao' => date('d/m/Y H:i:s')
    ];
    
    echo json_encode($estatisticas, JSON_UNESCAPED_UNICODE);
    exit;
}
?>
