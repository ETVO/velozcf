<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Cota.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cota = new Cota($db);

    $data = json_decode(file_get_contents('php://input'));

    $cota->numero = $data->numero;
    $cota->valor = $data->valor;
    $cota->data_inicio = $data->data_inicio;
    $cota->data_fim = $data->data_fim;
    $cota->disponivel = $data->disponivel;
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