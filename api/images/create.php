<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    
    include_once '../functions.php';
    include_once '../../config/Database.php';
    include_once '../../models/Image.php';
    
    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();
    
    // Instantiate request
    $image = new Image($db);

    $image->caption = $_POST['caption'];
    $image->url = $_FILES['file']['tmp_name'];
    $image->size = $_FILES['file']['size'];
    $image->filename = $_FILES['file']['name'];

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