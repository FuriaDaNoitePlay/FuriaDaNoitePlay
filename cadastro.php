<?php
// =============================================
// CADASTRO.PHP - SISTEMA AUTOMÁTICO FURIA DA NOITE
// Processa cadastros de membros e equipes
// =============================================

// Configurações
header('Content-Type: application/json; charset=utf-8');

// Habilitar CORS para permitir requisições do seu site
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Arquivo para salvar os dados (JSON)
$arquivo_usuarios = 'furia_usuarios.json';
$arquivo_equipes = 'furia_equipes.json';

// Inicializar arquivos se não existirem
function inicializarArquivo($arquivo) {
    if (!file_exists($arquivo)) {
        file_put_contents($arquivo, json_encode([]));
    }
}

inicializarArquivo($arquivo_usuarios);
inicializarArquivo($arquivo_equipes);

// Função para ler dados
function lerDados($arquivo) {
    $dados = file_get_contents($arquivo);
    return json_decode($dados, true) ?: [];
}

// Função para salvar dados
function salvarDados($arquivo, $dados) {
    return file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT));
}

// Função para validar email
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Função para validar WhatsApp
function validarWhatsApp($whatsapp) {
    // Remove caracteres não numéricos
    $whatsapp = preg_replace('/[^0-9]/', '', $whatsapp);
    return strlen($whatsapp) >= 10 && strlen($whatsapp) <= 15;
}

// Processar requisição
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipo = $_POST['tipo'] ?? '';
    $resposta = ['success' => false, 'message' => '', 'data' => null];

    try {
        if ($tipo === 'membro') {
            // ===== CADASTRO DE MEMBRO =====
            $nick = trim($_POST['nick'] ?? '');
            $senha = trim($_POST['senha'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $whatsapp = trim($_POST['whatsapp'] ?? '');
            $jogo = $_POST['jogo'] ?? '';
            $id_jogo = trim($_POST['id_jogo'] ?? '');

            // Validações
            if (empty($nick) || empty($senha) || empty($jogo) || empty($id_jogo)) {
                throw new Exception('❌ Preencha todos os campos obrigatórios!');
            }

            if (strlen($senha) < 4) {
                throw new Exception('❌ A senha deve ter pelo menos 4 caracteres!');
            }

            if ($email && !validarEmail($email)) {
                throw new Exception('❌ E-mail inválido!');
            }

            if ($whatsapp && !validarWhatsApp($whatsapp)) {
                throw new Exception('❌ WhatsApp inválido!');
            }

            // Verificar se nick já existe
            $usuarios = lerDados($arquivo_usuarios);
            foreach ($usuarios as $usuario) {
                if ($usuario['nick'] === $nick) {
                    throw new Exception('❌ Este nick já está cadastrado!');
                }
            }

            // Criar novo usuário
            $novoUsuario = [
                'id' => uniqid() . time(),
                'tipo' => 'membro',
                'nick' => $nick,
                'senha' => password_hash($senha, PASSWORD_DEFAULT),
                'email' => $email,
                'whatsapp' => $whatsapp,
                'jogo' => $jogo,
                'id_jogo' => $id_jogo,
                'data_cadastro' => date('Y-m-d H:i:s'),
                'status' => 'ativo',
                'nivel' => 'membro'
            ];

            // Adicionar à lista
            $usuarios[] = $novoUsuario;
            
            // Salvar dados
            if (salvarDados($arquivo_usuarios, $usuarios)) {
                $resposta['success'] = true;
                $resposta['message'] = '✅ Cadastro de membro concluído com sucesso! Você já pode fazer login.';
                $resposta['data'] = ['id' => $novoUsuario['id'], 'nick' => $nick];
                
                // Enviar para WhatsApp (opcional)
                enviarWhatsAppMembro($novoUsuario);
            } else {
                throw new Exception('❌ Erro ao salvar cadastro. Tente novamente.');
            }

        } elseif ($tipo === 'equipe') {
            // ===== CADASTRO DE EQUIPE =====
            $nome_equipe = trim($_POST['nome_equipe'] ?? '');
            $senha = trim($_POST['senha'] ?? '');
            $nick_lider = trim($_POST['nick_lider'] ?? '');
            $email = trim($_POST['email'] ?? '');

            // Validações
            if (empty($nome_equipe) || empty($senha) || empty($nick_lider) || empty($email)) {
                throw new Exception('❌ Preencha todos os campos obrigatórios!');
            }

            if (strtolower($senha) !== strtolower($nome_equipe)) {
                throw new Exception('❌ A senha deve ser igual ao nome da equipe!');
            }

            if (!validarEmail($email)) {
                throw new Exception('❌ E-mail inválido!');
            }

            // Verificar se equipe já existe
            $equipes = lerDados($arquivo_equipes);
            foreach ($equipes as $equipe) {
                if ($equipe['nome_equipe'] === $nome_equipe) {
                    throw new Exception('❌ Esta equipe já está cadastrada!');
                }
            }

            // Criar nova equipe
            $novaEquipe = [
                'id' => uniqid() . time(),
                'tipo' => 'equipe',
                'nome_equipe' => $nome_equipe,
                'senha' => password_hash($senha, PASSWORD_DEFAULT),
                'nick_lider' => $nick_lider,
                'email' => $email,
                'data_cadastro' => date('Y-m-d H:i:s'),
                'status' => 'pendente',
                'membros' => [$nick_lider],
                'pontuacao' => 0
            ];

            // Adicionar à lista
            $equipes[] = $novaEquipe;
            
            // Salvar dados
            if (salvarDados($arquivo_equipes, $equipes)) {
                $resposta['success'] = true;
                $resposta['message'] = '✅ Inscrição de equipe concluída com sucesso! Sua equipe já pode fazer login.';
                $resposta['data'] = ['id' => $novaEquipe['id'], 'nome_equipe' => $nome_equipe];
                
                // Enviar para WhatsApp (opcional)
                enviarWhatsAppEquipe($novaEquipe);
            } else {
                throw new Exception('❌ Erro ao salvar inscrição. Tente novamente.');
            }

        } else {
            throw new Exception('❌ Tipo de cadastro inválido!');
        }

    } catch (Exception $e) {
        $resposta['message'] = $e->getMessage();
    }

    echo json_encode($resposta);
    exit;

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // ===== CONSULTA DE DADOS =====
    $acao = $_GET['acao'] ?? '';
    
    if ($acao === 'verificar_nick') {
        $nick = $_GET['nick'] ?? '';
        $usuarios = lerDados($arquivo_usuarios);
        $existe = false;
        
        foreach ($usuarios as $usuario) {
            if ($usuario['nick'] === $nick) {
                $existe = true;
                break;
            }
        }
        
        echo json_encode(['existe' => $existe]);
        exit;
        
    } elseif ($acao === 'verificar_equipe') {
        $nome_equipe = $_GET['nome_equipe'] ?? '';
        $equipes = lerDados($arquivo_equipes);
        $existe = false;
        
        foreach ($equipes as $equipe) {
            if ($equipe['nome_equipe'] === $nome_equipe) {
                $existe = true;
                break;
            }
        }
        
        echo json_encode(['existe' => $existe]);
        exit;
        
    } elseif ($acao === 'estatisticas') {
        $usuarios = lerDados($arquivo_usuarios);
        $equipes = lerDados($arquivo_equipes);
        
        echo json_encode([
            'total_usuarios' => count($usuarios),
            'total_equipes' => count($equipes),
            'usuarios_ativos' => count(array_filter($usuarios, function($u) { return $u['status'] === 'ativo'; })),
            'equipes_ativas' => count(array_filter($equipes, function($e) { return $e['status'] === 'ativa'; }))
        ]);
        exit;
    }
}

// ===== FUNÇÕES WHATSAPP =====
function enviarWhatsAppMembro($usuario) {
    $numero_whatsapp = '5531997319008'; // Seu número
    
    $mensagem = rawurlencode(
        "📋 *NOVO CADASTRO DE MEMBRO - FURIA DA NOITE* 📋\n\n" .
        "🎮 *Nick no Jogo:* " . $usuario['nick'] . "\n" .
        "📧 *E-mail:* " . ($usuario['email'] ?: 'Não informado') . "\n" .
        "📱 *WhatsApp:* " . ($usuario['whatsapp'] ?: 'Não informado') . "\n" .
        "🎯 *Jogo Principal:* " . $usuario['jogo'] . "\n" .
        "🆔 *ID do Jogo:* " . $usuario['id_jogo'] . "\n" .
        "📅 *Data:* " . $usuario['data_cadastro'] . "\n\n" .
        "_Cadastro automático via Site FuriaDaNoitePlay_"
    );
    
    $url_whatsapp = "https://wa.me/{$numero_whatsapp}?text={$mensagem}";
    
    // Você pode salvar esta URL para uso posterior ou enviar por email
    file_put_contents('ultimo_cadastro_whatsapp.txt', $url_whatsapp);
}

function enviarWhatsAppEquipe($equipe) {
    $numero_whatsapp = '5531997319008'; // Seu número
    
    $mensagem = rawurlencode(
        "🏆 *NOVA INSCRIÇÃO DE EQUIPE - FURIA DA NOITE* 🏆\n\n" .
        "🏷️ *Nome da Equipe:* " . $equipe['nome_equipe'] . "\n" .
        "🎮 *Nick do Líder:* " . $equipe['nick_lider'] . "\n" .
        "📧 *E-mail do Líder:* " . $equipe['email'] . "\n" .
        "📅 *Data:* " . $equipe['data_cadastro'] . "\n" .
        "📊 *Status:* " . $equipe['status'] . "\n\n" .
        "_Inscrição automática via Site FuriaDaNoitePlay_"
    );
    
    $url_whatsapp = "https://wa.me/{$numero_whatsapp}?text={$mensagem}";
    
    // Salvar URL para uso posterior
    file_put_contents('ultima_equipe_whatsapp.txt', $url_whatsapp);
}

// Página HTML se acessada diretamente
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Cadastro - FuriaDaNoitePlay</title>
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
        .success { border: 2px solid #00ff00; color: #00ff00; }
        .error { border: 2px solid #ff0000; color: #ff0000; }
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
        <h1>⚙️ Sistema de Cadastro</h1>
        <p>FuriaDaNoitePlay - Backend</p>
        
        <div class="status">
            <?php
            $usuarios = lerDados($arquivo_usuarios);
            $equipes = lerDados($arquivo_equipes);
            
            echo "<p>📊 <strong>Estatísticas do Sistema:</strong></p>";
            echo "<p>👥 Usuários Cadastrados: " . count($usuarios) . "</p>";
            echo "<p>🏆 Equipes Cadastradas: " . count($equipes) . "</p>";
            echo "<p>✅ Sistema: <strong>OPERACIONAL</strong></p>";
            ?>
        </div>
        
        <p>Este é o backend do sistema de cadastro automático.</p>
        <p>Os dados são processados via AJAX a partir das páginas de cadastro.</p>
        
        <a href="cadastro.html" class="btn">📝 Ir para Cadastro</a>
        <a href="login.html" class="btn">🔐 Ir para Login</a>
        <a href="index.html" class="btn">🏠 Página Inicial</a>
    </div>
</body>
</html>