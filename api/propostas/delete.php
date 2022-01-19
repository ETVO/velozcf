<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Proposta.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $prop = new Proposta($db);

    $data = json_decode(file_get_contents('php://input'));

    $prop->id = $data->id;
    
    $prop->read_single();	
    $prop->unreserve_cotas();

    if($prop->delete()) {
        echo json_encode([
            'success' => true,
            'message' => 'Proposta excluída com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao excluir proposta.'
        ]);

    }