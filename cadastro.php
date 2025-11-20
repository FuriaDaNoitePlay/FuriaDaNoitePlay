<?php
// =============================================
// CADASTRO.PHP - SISTEMA DE CADASTRO ATUALIZADO
// Integrado com config.php
// =============================================

require_once 'config.php';

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
                
                $usuarios = $furiaConfig->lerDados('usuarios');
                
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
                    'senha' => $senha,
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
                
                if ($furiaConfig->salvarDados('usuarios', $usuarios)) {
                    $resposta['success'] = true;
                    $resposta['message'] = '✅ Membro cadastrado com sucesso!';
                    
                    // Atualizar estatísticas
                    $furiaConfig->atualizarEstatisticas();
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
                
                $equipes = $furiaConfig->lerDados('equipes');
                
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
                    'senha' => $senha,
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
                
                if ($furiaConfig->salvarDados('equipes', $equipes)) {
                    $resposta['success'] = true;
                    $resposta['message'] = '✅ Equipe cadastrada com sucesso!';
                    
                    // Atualizar estatísticas
                    $furiaConfig->atualizarEstatisticas();
                } else {
                    throw new Exception('❌ Erro ao salvar dados da equipe');
                }
                break;
                
            default:
                throw new Exception('❌ Tipo de cadastro inválido!');
        }
        
    } catch (Exception $e) {
        $resposta['message'] = $e->getMessage();
    }
    
    enviarResposta($resposta);
    exit;
}

// Se acessado via GET, mostrar estatísticas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $estatisticas = $furiaConfig->getEstatisticas();
    
    $info = [
        'success' => true,
        'sistema' => 'FuriaDaNoitePlay - Cadastro',
        'status' => 'operacional',
        'estatisticas' => $estatisticas,
        'ultima_atualizacao' => date('d/m/Y H:i:s')
    ];
    
    enviarResposta($info);
    exit;
}
?>
