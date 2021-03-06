<?php

    

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Empreendimento.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $empre = new Empreendimento($db);

    $data = json_decode(file_get_contents('php://input'));

    $empre->id = $data->id;

    if($empre->delete()) {
        echo json_encode([
            'success' => true,
            'message' => 'Empreendimento excluído com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao excluir empreendimento.'
        ]);

    }