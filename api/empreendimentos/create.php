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

    $empre->set_properties($data, ['logo', 'cover']);
    
    $empre->logo->id = (isset($data->logo_id)) ? $data->logo_id : $data->logo->id;
    $empre->cover->id = (isset($data->cover_id)) ? $data->cover_id : $data->cover->id;

    if($empre->create()) {
        echo json_encode([
            'data' => [
                'id' => $empre->id
            ],
            'success' => true,
            'message' => 'Empreendimento criado com sucesso.'
        ]);
    }
    else {
        $message = $empre->err_message ?? 'Erro ao criar empreendimento.';
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);

    }