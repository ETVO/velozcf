<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: DELETE');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    include_once '../../config/setup.php';
    include_once '../../models/Imobiliaria.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $imob = new Imobiliaria($db);

    $data = json_decode(file_get_contents('php://input'));

    $imob->id = $data->id;

    if($imob->delete()) {
        echo json_encode([
            'success' => true,
            'message' => 'Imobiliária excluída com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao excluir imobiliária.'
        ]);

    }