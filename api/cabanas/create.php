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

    $cabana->set_properties($data, ['imagem', 'empreendimento']);
    
    $cabana->imagem->id = (isset($data->imagem_id)) ? $data->imagem_id : $data->imagem->id;
    $cabana->empreendimento->id = (isset($data->empreendimento_id)) ? $data->empreendimento_id : $data->empreendimento->id;

    if($cabana->create()) {
        echo json_encode([
            'data' => [
                'id' => $cabana->id
            ],
            'success' => true,
            'message' => 'Cabana criada com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar cabana.'
        ]);

    }