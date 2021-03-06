<?php

    

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Cabana.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cabana = new Cabana($db);

    $data = json_decode(file_get_contents('php://input'));

    $cabana->id = $data->id;

    if($cabana->delete()) {
        echo json_encode([
            'success' => true,
            'message' => 'Cabana excluída com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao excluir cabana.'
        ]);

    }