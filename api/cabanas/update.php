<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    include_once '../../config/setup.php';
    include_once '../../models/Cabana.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cabana = new Cabana($db);

    $data = json_decode(file_get_contents('php://input'));

    $cabana->id = $data->id;
    $cabana->nome = $data->nome;
    $cabana->tamanho = $data->tamanho;
    $cabana->quartos = $data->quartos;
    $cabana->valor_base = $data->valor_base;
    $cabana->disponivel = $data->disponivel;
    $cabana->reservada = $data->reservada;
    $cabana->imagem->id = (isset($data->imagem_id)) ? $data->imagem_id : $data->imagem->id;
    $cabana->galeria = $data->galeria;
    $cabana->id_mapa = $data->id_mapa;
    $cabana->empreendimento->id = (isset($data->empreendimento_id)) ? $data->empreendimento_id : $data->empreendimento->id;

    if($cabana->update()) {
        echo json_encode([
            'success' => true,
            'message' => 'Cabana atualizada.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar cabana.'
        ]);

    }