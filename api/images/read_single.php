<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Image.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $image = new Image($db);

    // Get ID from URL
    $image->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($image->read_single()) {

        $img_arr = [
            'id' => $image->id,
            'url' => $image->url,
            'caption' => $image->caption,
            'size' => $image->size,
            'updated_at' => $image->updated_at,
        ];
    
        // Make JSON
        print_r(json_encode($img_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Imagem não encontrada.'
        ]);
    }
