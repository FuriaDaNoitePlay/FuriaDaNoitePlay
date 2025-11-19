<?php
// cadastro.php - Sistema de cadastro para Furia da Noite
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    // Simular processamento
    sleep(2);
    
    // Simular sucesso no cadastro
    $resposta = [
        'success' => true,
        'message' => 'Cadastro aprovado automaticamente!',
        'usuario' => [
            'id' => time(),
            'nickname' => $dados['nickname'],
            'jogo' => $dados['jogo'],
            'whatsapp' => $dados['whatsapp'],
            'data_cadastro' => date('Y-m-d H:i:s')
        ]
    ];
    
    echo json_encode($resposta);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
?>
