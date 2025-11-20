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

// Se acessado diretamente, mostrar interface
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Cadastro - FuriaDaNoitePlay</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0000 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            width: 100%;
            background: rgba(0,0,0,0.9);
            padding: 40px;
            border-radius: 20px;
            border: 3px solid #ff0000;
            box-shadow: 0 0 50px rgba(255,0,0,0.5);
            text-align: center;
        }
        
        h1 {
            color: #ff0000;
            text-shadow: 0 0 20px #ff0000;
            margin-bottom: 20px;
            font-size: 2.5rem;
        }
        
        .status {
            margin: 30px 0;
            padding: 25px;
            border-radius: 15px;
            background: rgba(255,0,0,0.1);
            border-left: 5px solid #ff0000;
            text-align: left;
        }
        
        .status h2 {
            color: #FFD700;
            margin-bottom: 15px;
            text-shadow: 0 0 10px #FFD700;
        }
        
        .status p {
            margin: 10px 0;
            font-size: 1.1rem;
        }
        
        .btn-group {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin: 30px 0;
        }
        
        .btn {
            background: #ff0000;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
            font-weight: bold;
        }
        
        .btn:hover {
            background: #cc0000;
            box-shadow: 0 0 20px #ff0000;
            transform: translateY(-2px);
        }
        
        .btn-success {
            background: #00cc00;
        }
        
        .btn-success:hover {
            background: #009900;
            box-shadow: 0 0 20px #00cc00;
        }
        
        .info-box {
            background: rgba(255, 215, 0, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #FFD700;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            .btn-group {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 Sistema de Cadastro</h1>
        <p>FuriaDaNoitePlay - Backend PHP</p>
        
        <div class="status">
            <h2>📊 Status do Sistema</h2>
            <?php
            $estatisticas = $furiaConfig->getEstatisticas();
            $info = $furiaConfig->getInfoSistema();
            
            echo "<p>✅ <strong>Sistema de cadastro:</strong> OPERACIONAL</p>";
            echo "<p>🔐 <strong>Tipos suportados:</strong> MEMBRO, EQUIPE</p>";
            echo "<p>👤 <strong>Membros cadastrados:</strong> " . $estatisticas['total_usuarios'] . "</p>";
            echo "<p>🏆 <strong>Equipes cadastradas:</strong> " . $estatisticas['total_equipes'] . "</p>";
            echo "<p>🕒 <strong>Última atualização:</strong> " . $estatisticas['ultima_atualizacao'] . "</p>";
            echo "<p>⚙️ <strong>Versão:</strong> " . $info['versao'] . "</p>";
            ?>
        </div>
        
        <div class="info-box">
            <h3>🚀 Sistema Integrado</h3>
            <p>Frontend HTML + Backend PHP funcionando em conjunto</p>
            <p>✅ Validações robustas</p>
            <p>✅ Sistema de logs</p>
            <p>✅ Estatísticas automáticas</p>
            <p>✅ Design responsivo</p>
        </div>
        
        <div class="btn-group">
            <a href="cadastro.html" class="btn">📝 Ir para Cadastro</a>
            <a href="login.html" class="btn btn-success">🔐 Ir para Login</a>
            <a href="furia.html" class="btn">🏠 Página Inicial</a>
        </div>
        
        <div style="margin-top: 30px; font-size: 0.9rem; opacity: 0.8;">
            <p>© 2025 FuriaDaNoitePlay - Sistema Completo</p>
            <p>Frontend + Backend Integrados</p>
        </div>
    </div>
</body>
</html>
