<?php

    include_once '../../config/setup.php';
include_once '../../config/authenticate.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $user = new User($db);

    $data = json_decode(file_get_contents('php://input'));

    $user->set_properties($data, ['info', 'photo', 'imobiliaria']);
    
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
        $message = 'Erro ao criar usuário.';

        $usernameTaken = ($user->sqlstate == 23000);

        if($usernameTaken) {
            $message = 'O nome de usuário já está em uso!';
        }

        echo json_encode([
            'success' => false,
            'message' => $message,
            'username_taken' => $usernameTaken
        ]);

    }