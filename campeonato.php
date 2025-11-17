<?php
// =============================================
// CAMPEONATO.PHP - SISTEMA DE CAMPEONATOS FURIA DA NOITE
// =============================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Arquivos JSON
$arquivo_equipes = 'furia_equipes.json';
$arquivo_campeonato = 'campeonato_data.json';

// Credenciais ADM
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

// Função para salvar dados
function salvarDados($arquivo, $dados) {
    return file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Inicializar dados do campeonato se não existirem
function inicializarCampeonato() {
    global $arquivo_campeonato;
    
    if (!file_exists($arquivo_campeonato)) {
        $dadosIniciais = [
            'confrontos' => [],
            'ultima_atualizacao' => date('Y-m-d H:i:s'),
            'versao' => '1.0'
        ];
        salvarDados($arquivo_campeonato, $dadosIniciais);
    }
}

inicializarCampeonato();

// Processar requisições
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'] ?? '';
    $resposta = ['success' => false, 'message' => '', 'data' => null];
    
    try {
        switch($acao) {
            case 'login_adm':
                $username = trim($_POST['username'] ?? '');
                $password = trim($_POST['password'] ?? '');
                
                if (isset($adminCredentials[$username]) && $adminCredentials[$username] === $password) {
                    $resposta['success'] = true;
                    $resposta['message'] = '✅ Login ADM bem-sucedido!';
                    $resposta['data'] = [
                        'username' => $username,
                        'nivel' => ($username === 'FURIAGOD') ? 'supremo' : 'geral'
                    ];
                } else {
                    throw new Exception('❌ Credenciais ADM inválidas!');
                }
                break;
                
            case 'get_equipes_serie':
                $serie = $_POST['serie'] ?? '';
                $equipes = lerDados($arquivo_equipes);
                
                $equipesFiltradas = array_filter($equipes['equipes'] ?? [], function($equipe) use ($serie) {
                    return $equipe['serie'] === strtolower($serie) && $equipe['status'] === 'ativa';
                });
                
                // Ordenar por pontuação (maior primeiro)
                usort($equipesFiltradas, function($a, $b) {
                    return $b['pontuacao'] - $a['pontuacao'];
                });
                
                $resposta['success'] = true;
                $resposta['data'] = array_values($equipesFiltradas);
                break;
                
            case 'get_todas_equipes':
                $equipes = lerDados($arquivo_equipes);
                $resposta['success'] = true;
                $resposta['data'] = $equipes['equipes'] ?? [];
                break;
                
            case 'adicionar_equipe':
                $nome_equipe = trim($_POST['nome_equipe'] ?? '');
                $serie = $_POST['serie'] ?? '';
                
                if (empty($nome_equipe) || empty($serie)) {
                    throw new Exception('❌ Preencha todos os campos!');
                }
                
                $equipes = lerDados($arquivo_equipes);
                
                // Verificar se equipe já existe
                foreach ($equipes['equipes'] as $equipe) {
                    if ($equipe['nome_equipe'] === $nome_equipe) {
                        throw new Exception('❌ Esta equipe já está cadastrada!');
                    }
                }
                
                // Adicionar nova equipe
                $novaEquipe = [
                    'id' => 'equipe_' . uniqid() . '_' . time(),
                    'tipo' => 'equipe',
                    'nome_equipe' => $nome_equipe,
                    'senha' => password_hash($nome_equipe, PASSWORD_DEFAULT),
                    'nick_lider' => 'ADM_Campeonato',
                    'email' => 'campeonato@furiadanoite.com',
                    'data_cadastro' => date('Y-m-d H:i:s'),
                    'status' => 'ativa',
                    'membros' => ['ADM_Campeonato'],
                    'jogo_principal' => 'campeonato',
                    'pontuacao' => 0,
                    'vitorias' => 0,
                    'derrotas' => 0,
                    'serie' => strtolower($serie)
                ];
                
                $equipes['equipes'][] = $novaEquipe;
                $equipes['total_equipes'] = count($equipes['equipes']);
                $equipes['ultima_atualizacao'] = date('Y-m-d H:i:s');
                
                if (salvarDados($arquivo_equipes, $equipes)) {
                    $resposta['success'] = true;
                    $resposta['message'] = '✅ Equipe adicionada com sucesso!';
                    $resposta['data'] = $novaEquipe;
                } else {
                    throw new Exception('❌ Erro ao salvar equipe.');
                }
                break;
                
            case 'atualizar_pontuacao':
                $equipe_id = $_POST['equipe_id'] ?? '';
                $nova_pontuacao = intval($_POST['pontuacao'] ?? 0);
                $vitorias = intval($_POST['vitorias'] ?? 0);
                $derrotas = intval($_POST['derrotas'] ?? 0);
                
                $equipes = lerDados($arquivo_equipes);
                $encontrada = false;
                
                foreach ($equipes['equipes'] as &$equipe) {
                    if ($equipe['id'] === $equipe_id) {
                        $equipe['pontuacao'] = $nova_pontuacao;
                        $equipe['vitorias'] = $vitorias;
                        $equipe['derrotas'] = $derrotas;
                        $encontrada = true;
                        break;
                    }
                }
                
                if ($encontrada && salvarDados($arquivo_equipes, $equipes)) {
                    $resposta['success'] = true;
                    $resposta['message'] = '✅ Pontuação atualizada com sucesso!';
                } else {
                    throw new Exception('❌ Erro ao atualizar pontuação.');
                }
                break;
                
            default:
                throw new Exception('❌ Ação inválida!');
        }
        
    } catch (Exception $e) {
        $resposta['message'] = $e->getMessage();
    }
    
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

// Requisições GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $acao = $_GET['acao'] ?? '';
    
    switch($acao) {
        case 'estatisticas':
            $equipes = lerDados($arquivo_equipes);
            $campeonato = lerDados($arquivo_campeonato);
            
            $estatisticas = [
                'total_equipes' => count($equipes['equipes'] ?? []),
                'equipes_serie_a' => count(array_filter($equipes['equipes'] ?? [], function($e) { return $e['serie'] === 'a'; })),
                'equipes_serie_b' => count(array_filter($equipes['equipes'] ?? [], function($e) { return $e['serie'] === 'b'; })),
                'equipes_serie_c' => count(array_filter($equipes['equipes'] ?? [], function($e) { return $e['serie'] === 'c'; })),
                'total_confrontos' => count($campeonato['confrontos'] ?? []),
                'ultima_atualizacao' => $equipes['ultima_atualizacao'] ?? 'N/A'
            ];
            
            echo json_encode($estatisticas, JSON_UNESCAPED_UNICODE);
            break;
            
        default:
            echo json_encode(['error' => 'Ação não especificada'], JSON_UNESCAPED_UNICODE);
    }
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Campeonato - FuriaDaNoitePlay</title>
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
        <h1>🏆 Sistema de Campeonato</h1>
        <p>FuriaDaNoitePlay - Backend</p>
        
        <div class="status">
            <?php
            $equipes = lerDados($arquivo_equipes);
            $estatisticas = [
                'total' => count($equipes['equipes'] ?? []),
                'serie_a' => count(array_filter($equipes['equipes'] ?? [], function($e) { return $e['serie'] === 'a'; })),
                'serie_b' => count(array_filter($equipes['equipes'] ?? [], function($e) { return $e['serie'] === 'b'; })),
                'serie_c' => count(array_filter($equipes['equipes'] ?? [], function($e) { return $e['serie'] === 'c'; }))
            ];
            
            echo "<p>📊 <strong>Backend Campeonato:</strong></p>";
            echo "<p>✅ Sistema: <strong>OPERACIONAL</strong></p>";
            echo "<p>🏆 Total Equipes: {$estatisticas['total']}</p>";
            echo "<p>⚡ Série A: {$estatisticas['serie_a']}</p>";
            echo "<p>🔥 Série B: {$estatisticas['serie_b']}</p>";
            echo "<p>💫 Série C: {$estatisticas['serie_c']}</p>";
            ?>
        </div>
        
        <p>Este é o backend do sistema de campeonatos.</p>
        <p>Os dados são processados via AJAX.</p>
        
        <a href="campeonato.html" class="btn">🏆 Ir para Campeonato</a>
        <a href="index.html" class="btn">🏠 Página Inicial</a>
    </div>
</body>
</html>