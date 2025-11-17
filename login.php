<?php
// =============================================
// LOGIN.PHP - SISTEMA DE AUTENTICAÇÃO FURIA DA NOITE
// =============================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Arquivos JSON
$arquivo_usuarios = 'furia_usuarios.json';
$arquivo_equipes = 'furia_equipes.json';

// Credenciais dos ADMs (senhas reais)
$adminCredentials = [
    'FURIAGOD' => 'Furia2025_$25',
    'Scorpion' => 'Mlk0025',
    '.Son King' => 'God1925', 
    'NeferpitouI' => 'Ana02525',
    'PNTS' => 'pNtS25',
    'ToxicSkull√' => 'L@!on25'
];

// Função para ler dados JSON
function lerDados($arquivo) {
    if (!file_exists($arquivo)) {
        return [];
    }
    $dados = file_get_contents($arquivo);
    return json_decode($dados, true) ?: [];
}

// Processar requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipo = $_POST['tipo'] ?? '';
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    $resposta = ['success' => false, 'message' => '', 'redirect' => ''];
    
    try {
        if (empty($username) || empty($password)) {
            throw new Exception('❌ Preencha todos os campos!');
        }
        
        $loginValido = false;
        $userData = null;
        
        switch($tipo) {
            case 'adm':
                // Verificar ADM
                if (isset($adminCredentials[$username]) && $adminCredentials[$username] === $password) {
                    $loginValido = true;
                    $userData = [
                        'username' => $username,
                        'tipo' => 'adm',
                        'nivel' => ($username === 'FURIAGOD') ? 'supremo' : 'geral'
                    ];
                    $resposta['redirect'] = ($username === 'FURIAGOD') ? 'painel-adm.html' : 'painel-usuario.html';
                    $resposta['message'] = '✅ Login ADM bem-sucedido!';
                } else {
                    throw new Exception('❌ Credenciais ADM inválidas!');
                }
                break;
                
            case 'membro':
                // Verificar membro nos usuários
                $usuarios = lerDados($arquivo_usuarios);
                foreach ($usuarios as $usuario) {
                    if ($usuario['nick'] === $username && password_verify($password, $usuario['senha'])) {
                        $loginValido = true;
                        $userData = $usuario;
                        $resposta['redirect'] = 'painel-usuario.html';
                        $resposta['message'] = '✅ Login de membro bem-sucedido!';
                        break;
                    }
                }
                
                if (!$loginValido) {
                    throw new Exception('❌ Membro não encontrado ou senha incorreta!');
                }
                break;
                
            case 'equipe':
                // Verificar equipe
                $equipes = lerDados($arquivo_equipes);
                foreach ($equipes as $equipe) {
                    if ($equipe['nome_equipe'] === $username && password_verify($password, $equipe['senha'])) {
                        $loginValido = true;
                        $userData = $equipe;
                        $resposta['redirect'] = 'painel-equipe.html';
                        $resposta['message'] = '✅ Login de equipe bem-sucedido!';
                        break;
                    }
                }
                
                if (!$loginValido) {
                    throw new Exception('❌ Equipe não encontrada ou senha incorreta!');
                }
                break;
                
            default:
                throw new Exception('❌ Tipo de login inválido!');
        }
        
        if ($loginValido && $userData) {
            $resposta['success'] = true;
            
            // Iniciar sessão (se estiver usando sessions)
            session_start();
            $_SESSION['furia_user'] = $userData;
            $_SESSION['furia_tipo'] = $tipo;
            $_SESSION['furia_login_time'] = time();
            
            // Também salvar em localStorage via JavaScript
            $resposta['user_data'] = $userData;
        }
        
    } catch (Exception $e) {
        $resposta['message'] = $e->getMessage();
    }
    
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

// Se acessado via GET, mostrar estatísticas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $usuarios = lerDados($arquivo_usuarios);
    $equipes = lerDados($arquivo_equipes);
    
    $estatisticas = [
        'total_usuarios' => count($usuarios),
        'total_equipes' => count($equipes),
        'admins_ativos' => 6, // ADMs fixos
        'sistema_status' => 'operacional'
    ];
    
    echo json_encode($estatisticas, JSON_UNESCAPED_UNICODE);
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Login - FuriaDaNoitePlay</title>
    <style>
        body {
            font-family: 'Orbitron', sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0000 100%);
            color: white;
            text-align: center;
            padding: 50px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(0,0,0,0.8);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #ff0000;
            box-shadow: 0 0 30px rgba(255,0,0,0.5);
        }
        h1 {
            color: #ff0000;
            text-shadow: 0 0 20px #ff0000;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 10px;
            background: rgba(255,0,0,0.1);
        }
        .btn {
            background: #ff0000;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: #cc0000;
            box-shadow: 0 0 15px #ff0000;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Sistema de Login</h1>
        <p>FuriaDaNoitePlay - Backend</p>
        
        <div class="status">
            <?php
            $usuarios = lerDados($arquivo_usuarios);
            $equipes = lerDados($arquivo_equipes);
            
            echo "<p>📊 <strong>Backend Login:</strong></p>";
            echo "<p>✅ Sistema de autenticação: <strong>OPERACIONAL</strong></p>";
            echo "<p>🔐 Tipos suportados: ADM, MEMBRO, EQUIPE</p>";
            echo "<p>👑 ADMs ativos: 6</p>";
            ?>
        </div>
        
        <p>Este é o backend do sistema de login.</p>
        <p>As autenticações são processadas via AJAX.</p>
        
        <a href="login.html" class="btn">🔐 Ir para Login</a>
        <a href="cadastro.html" class="btn">📝 Ir para Cadastro</a>
        <a href="index.html" class="btn">🏠 Página Inicial</a>
    </div>
</body>
</html>