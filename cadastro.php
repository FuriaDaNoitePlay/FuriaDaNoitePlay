<?php
// =============================================
// RANKING.PHP - SISTEMA DE RANKING
// =============================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$arquivo_ranking = 'data/furia_ranking.json';

function lerDados($arquivo) {
    if (!file_exists($arquivo)) return [];
    $dados = file_get_contents($arquivo);
    return json_decode($dados, true) ?: [];
}

function salvarDados($arquivo, $dados) {
    return file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $acao = $_GET['acao'] ?? '';
    
    if ($acao === 'listar') {
        $ranking = lerDados($arquivo_ranking);
        
        // Ordenar por pontuação (maior primeiro)
        usort($ranking, function($a, $b) {
            return $b['pontuacao'] - $a['pontuacao'];
        });
        
        // Atualizar posições
        foreach ($ranking as $index => &$item) {
            $item['posicao'] = $index + 1;
        }
        
        echo json_encode(array_slice($ranking, 0, 250), JSON_UNESCAPED_UNICODE); // Top 250
        exit;
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Atualizar pontuação (para o jogo do dragão)
        $dados = json_decode(file_get_contents('php://input'), true);
        
        if ($dados && isset($dados['nick']) && isset($dados['pontuacao'])) {
            $ranking = lerDados($arquivo_ranking);
            $encontrado = false;
            
            foreach ($ranking as &$item) {
                if ($item['nome'] === $dados['nick']) {
                    if ($dados['pontuacao'] > $item['pontuacao']) {
                        $item['pontuacao'] = $dados['pontuacao'];
                        $item['vitorias']++;
                        $item['ultima_atualizacao'] = date('d/m/Y H:i:s');
                    } else {
                        $item['derrotas']++;
                    }
                    $encontrado = true;
                    break;
                }
            }
            
            if (!$encontrado) {
                // Adicionar novo ao ranking
                $ranking[] = [
                    'id' => uniqid('rank_') . time(),
                    'nome' => $dados['nick'],
                    'tipo' => 'usuario',
                    'jogo' => 'dragao',
                    'pontuacao' => $dados['pontuacao'],
                    'vitorias' => 1,
                    'derrotas' => 0,
                    'posicao' => count($ranking) + 1,
                    'data_entrada' => date('d/m/Y H:i:s'),
                    'ultima_atualizacao' => date('d/m/Y H:i:s')
                ];
            }
            
            if (salvarDados($arquivo_ranking, $ranking)) {
                echo json_encode(['success' => true, 'message' => 'Ranking atualizado!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao salvar ranking']);
            }
        }
        exit;
    }
}

// Página do ranking
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏆 Ranking - FuriaDaNoitePlay</title>
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
            padding: 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        h1 {
            color: #FFD700;
            font-size: 3rem;
            text-shadow: 0 0 20px #FFD700;
            margin-bottom: 10px;
        }
        
        .ranking-table {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            overflow: hidden;
            border: 2px solid #FFD700;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid #333;
        }
        
        th {
            background: rgba(255,215,0,0.3);
            color: #FFD700;
            font-weight: bold;
        }
        
        .top-1 { background: linear-gradient(45deg, #FFD700, #FFEC8B); color: #000; font-weight: bold; }
        .top-2 { background: linear-gradient(45deg, #C0C0C0, #E8E8E8); color: #000; }
        .top-3 { background: linear-gradient(45deg, #CD7F32, #E8B886); color: #000; }
        
        .posicao {
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .btn {
            background: #FFD700;
            color: #000;
            padding: 12px 25px;
            border: none;
            border-radius: 25px;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            margin: 20px 10px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 RANKING GLOBAL</h1>
            <p style="color: #FFD700; font-size: 1.2rem;">Top 250 Jogadores e Equipes</p>
        </div>
        
        <div class="ranking-table">
            <table>
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Jogo</th>
                        <th>Pontuação</th>
                        <th>Vitórias</th>
                    </tr>
                </thead>
                <tbody id="ranking-body">
                    <!-- Dados do ranking serão carregados via JavaScript -->
                </tbody>
            </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="index.html" class="btn">🏠 Voltar ao Início</a>
            <a href="login.html" class="btn">🔐 Fazer Login</a>
            <button class="btn" onclick="carregarRanking()">🔄 Atualizar</button>
        </div>
    </div>

    <script>
        async function carregarRanking() {
            try {
                const response = await fetch('ranking.php?acao=listar');
                const ranking = await response.json();
                
                const tbody = document.getElementById('ranking-body');
                tbody.innerHTML = '';
                
                ranking.forEach((item, index) => {
                    const row = document.createElement('tr');
                    
                    // Classes para os top 3
                    let rowClass = '';
                    if (index === 0) rowClass = 'top-1';
                    else if (index === 1) rowClass = 'top-2';
                    else if (index === 2) rowClass = 'top-3';
                    
                    row.className = rowClass;
                    row.innerHTML = `
                        <td class="posicao">${item.posicao}º</td>
                        <td>${item.nome}</td>
                        <td>${item.tipo === 'usuario' ? '👤' : '🏆'} ${item.tipo}</td>
                        <td>${item.jogo}</td>
                        <td><strong>${item.pontuacao}</strong></td>
                        <td>${item.vitorias}</td>
                    `;
                    
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Erro ao carregar ranking:', error);
            }
        }
        
        // Carregar ranking ao iniciar
        document.addEventListener('DOMContentLoaded', carregarRanking);
    </script>
</body>
</html>
