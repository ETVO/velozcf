<?php

    include_once '../../config/setup.php';
include_once '../../config/authenticate.php';
    include_once '../../models/Imobiliaria.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $imob = new Imobiliaria($db);

    $data = json_decode(file_get_contents('php://input'));

    $imob->set_properties($data);
    
    if($imob->create()) {
        echo json_encode([
            'data' => [
                'id' => $imob->id
            ],
            'success' => true,
            'message' => 'Imobiliária criada com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar imobiliária.'
        ]);

    }