<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Cota.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cota = new Cota($db);

    $data = json_decode(file_get_contents('php://input'));

    $cota->set_properties($data, ['cabana']);

    $cota->cabana->id = (isset($data->cabana_id)) ? $data->cabana_id : $data->cabana->id;

    if($cota->create()) {
        echo json_encode([
            'data' => [
                'id' => $cota->id
            ],
            'success' => true,
            'message' => 'Cota criada com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar cota.'
        ]);

    }