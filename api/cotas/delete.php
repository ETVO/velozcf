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

    $cota->id = $data->id;

    if($cota->delete()) {
        echo json_encode([
            'success' => true,
            'message' => 'Cabana excluída com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao excluir cota.'
        ]);

    }