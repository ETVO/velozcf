<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $user = new User($db);

    $data = json_decode(file_get_contents('php://input'));

    $user->username = $data->username;
    $user->password = $data->password;
    $user->estado_civil = $data->estado_civil;
    $user->creci = $data->creci;
    $user->blocked = $data->blocked;
    
    $user->info->set_properties($data->info);
    
    $user->photo->id = (isset($data->photo_id)) ? $data->photo_id : $data->photo->id;
    $user->imobiliaria->id = (isset($data->imobiliaria_id)) ? $data->imobiliaria_id : $data->imobiliaria->id;

    if($user->create()) {
        echo json_encode([
            'data' => [
                'id' => $user->id
            ],
            'success' => true,
            'message' => 'Usuário criado com sucesso.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar usuário.'
        ]);

    }