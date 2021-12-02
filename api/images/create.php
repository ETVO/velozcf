<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Image.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $image = new Image($db);

    $data = json_decode(file_get_contents('php://input'));

    $image->url = $data->url;
    $image->caption = $data->caption;
    $image->size = $data->size;

    if($image->create()) {
        echo json_encode([
            'data' => [
                'id' => $image->id
            ],
            'success' => true,
            'message' => 'Imagem criada com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar imagem.'
        ]);

    }