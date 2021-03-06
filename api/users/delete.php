<?php

    

    include_once '../../config/setup.php';
include_once '../../config/authenticate.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $user = new User($db);

    $data = json_decode(file_get_contents('php://input'));

    $user->id = $data->id;

    if($user->id == 1) {
        echo json_encode([
            'success' => false,
            'message' => 'Este usuário não pode ser excluído.'
        ]);
    }
    else if($user->delete()) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuário excluído com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao excluir usuário.'
        ]);

    }