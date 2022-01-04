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
    $cota->numero = $data->numero;
    $cota->valor = $data->valor;
    $cota->data_inicio = $data->data_inicio;
    $cota->data_fim = $data->data_fim;
    $cota->disponivel = $data->disponivel;
    $cota->reservada = $data->reservada;
    $cota->cabana->id = (isset($data->cabana_id)) ? $data->cabana_id : $data->cabana->id;

    if($cota->update()) {
        echo json_encode([
            'success' => true,
            'message' => 'Cota atualizada.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar cota.'
        ]);

    }