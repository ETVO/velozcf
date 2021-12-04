<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $user = new User($db);

    // Get ID from URL
    $user->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($user->read_single()) {

        $user_arr = [
            'id' => intval($user->id),
            'nome' => $user->nome,
            'info' => $user->info,
            'photo' => [
                'id' => intval($user->photo->id),
                'url' => $user->photo->url,
                'caption' => $user->photo->caption
            ],
            'imobiliaria_id' => intval($user->imobiliaria->id)
        ];
    
        // Make JSON
        print_r(json_encode($user_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário não encontrado.'
        ]);
    }
