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
?>
