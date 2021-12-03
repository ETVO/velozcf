<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Empreendimento.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $empre = new Empreendimento($db);

    $data = json_decode(file_get_contents('php://input'));

    $empre->id = $data->id;
    $empre->nome = $data->nome;
    $empre->endereco = $data->endereco;
    $empre->area_cabana = $data->area_cabana;
    $empre->deleted = $data->deleted;
    $empre->logo->id = (isset($data->logo_id)) ? $data->logo_id : $data->logo->id;
    $empre->cover->id = (isset($data->cover_id)) ? $data->cover_id : $data->cover->id;

    if($empre->update()) {
        echo json_encode([
            'success' => true,
            'message' => 'Empreendimento atualizado.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar empreendimento.'
        ]);

    }