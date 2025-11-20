<?php
// =============================================
// LOGIN.PHP - SISTEMA DE LOGIN ATUALIZADO  
// Integrado com config.php
// =============================================

require_once 'config.php';

// Processar requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipo = $_POST['tipo'] ?? '';
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    $resposta = ['success' => false, 'message' => ''];
    
    try {
        if (empty($username) || empty($password)) {
            throw new Exception('❌ Preencha todos os campos!');
        }
        
        $loginValido = false;
        $userData = null;
        
        switch($tipo) {
            case 'adm':
                $resultado = $furiaConfig->validarAdmin($username, $password);
                if ($resultado['success']) {
                    $loginValido = true;
                    $userData = $resultado['usuario'];
                    $resposta['message'] = '✅ Login ADM bem-sucedido!';
                    $resposta['redirect'] = ($username === 'FURIAGOD') ? 'painel-adm.html' : 'painel-usuario.html';
                } else {
                    throw new Exception('❌ Credenciais ADM inválidas!');
                }
                break;
                
            case 'membro':
                $resultado = $furiaConfig->validarMembro($username, $password);
                if ($resultado['success']) {
                    $loginValido = true;
                    $userData = $resultado['usuario'];
                    $resposta['message'] = '✅ Login de membro bem-sucedido!';
                    $resposta['redirect'] = 'painel-usuario.html';
                } else {
                    throw new Exception('❌ Membro não encontrado ou senha incorreta!');
                }
                break;
                
            case 'equipe':
                $resultado = $furiaConfig->validarEquipe($username, $password);
                if ($resultado['success']) {
                    $loginValido = true;
                    $userData = $resultado['usuario'];
                    $resposta['message'] = '✅ Login de equipe bem-sucedido!';
                    $resposta['redirect'] = 'painel-equipe.html';
                } else {
                    throw new Exception('❌ Equipe não encontrada ou senha incorreta!');
                }
                break;
                
            default:
                throw new Exception('❌ Tipo de login inválido!');
        }
        
        if ($loginValido && $userData) {
            $resposta['success'] = true;
            $resposta['user_data'] = $userData;
            
            // Iniciar sessão PHP
            session_start();
            $_SESSION['furia_user'] = $userData;
            $_SESSION['furia_tipo'] = $tipo;
            $_SESSION['furia_login_time'] = time();
        }
        
    } catch (Exception $e) {
        $resposta['message'] = $e->getMessage();
    }
    
    enviarResposta($resposta);
    exit;
}

// Se acessado via GET, mostrar informações
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $info = $furiaConfig->getInfoSistema();
    $info['modulo'] = 'Login';
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
    <title>Backend Login - FuriaDaNoitePlay</title>
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Sistema de Login</h1>
        <p>FuriaDaNoitePlay - Backend PHP</p>
        
        <div class="status">
            <h2>📊 Status do Sistema</h2>
            <?php
            $info = $furiaConfig->getInfoSistema();
            $estatisticas = $furiaConfig->getEstatisticas();
            
            echo "<p>✅ <strong>Sistema de autenticação:</strong> OPERACIONAL</p>";
            echo "<p>🔐 <strong>Tipos suportados:</strong> ADM, MEMBRO, EQUIPE</p>";
            echo "<p>👑 <strong>ADMs ativos:</strong> 6</p>";
            echo "<p>👤 <strong>Membros cadastrados:</strong> " . $estatisticas['total_usuarios'] . "</p>";
            echo "<p>🏆 <strong>Equipes cadastradas:</strong> " . $estatisticas['total_equipes'] . "</p>";
            echo "<p>🕒 <strong>Última atualização:</strong> " . date('d/m/Y H:i:s') . "</p>";
            ?>
        </div>
        
        <div class="info-box">
            <h3>🚀 Sistema Integrado</h3>
            <p>Frontend HTML + Backend PHP funcionando em conjunto</p>
            <p>✅ Autenticação em tempo real</p>
            <p>✅ Sistema de logs</p>
            <p>✅ Validações robustas</p>
            <p>✅ Design responsivo</p>
        </div>
        
        <div class="btn-group">
            <a href="login.html" class="btn">🔐 Ir para Login</a>
            <a href="cadastro.html" class="btn btn-success">📝 Ir para Cadastro</a>
            <a href="furia.html" class="btn">🏠 Página Inicial</a>
        </div>
        
        <div style="margin-top: 30px; font-size: 0.9rem; opacity: 0.8;">
            <p>© 2025 FuriaDaNoitePlay - Sistema Completo</p>
            <p>Frontend + Backend Integrados</p>
        </div>
    </div>
</body>
</html>
<?php
}
?>
