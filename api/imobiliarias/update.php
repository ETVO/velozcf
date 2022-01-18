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

    $imob->set_properties($data, ['representante']);

    $cota->representante->id = (isset($data->representante_id)) ? $data->representante_id : $data->representante->id;

    if($imob->update()) {
        echo json_encode([
            'success' => true,
            'message' => 'Imobiliária atualizada.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar imobiliária.'
        ]);

    }