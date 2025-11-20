<?php
// auth-check.php
session_start();
header('Content-Type: application/json');

// Verificar se há usuário logado
if (!isset($_SESSION['furia_user'])) {
    echo json_encode(['authenticated' => false]);
    exit;
}

// Retornar dados da sessão
$response = [
    'authenticated' => true,
    'user' => $_SESSION['furia_user'],
    'tipo' => $_SESSION['furia_tipo']
];

echo json_encode($response);
?>
