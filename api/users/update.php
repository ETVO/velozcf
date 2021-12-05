<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    include_once '../../config/setup.php';
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

    if($user->update()) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuário atualizado.'
        ]);
    }
    else {
        $message = 'Erro ao atualizar usuário.';

        $usernameTaken = ($user->sqlstate == 23000);

        if($usernameTaken) {
            $message = 'O nome de usuário já está em uso!';
        }

        print_r($db->errorInfo());

        echo json_encode([
            'success' => false,
            'message' => $message,
            'username_taken' => $usernameTaken
        ]);
    }