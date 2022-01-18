<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();
    
    // Get auth username
    $auth = new User($db);
    
    // Get data from HTTP Authorization Header (Basic token)
    $auth->username = $_SERVER['PHP_AUTH_USER'];
    $auth->password = $_SERVER['PHP_AUTH_PW'];

    $auth->read_single();
    
    $data = json_decode(file_get_contents('php://input'));
        
    // Instantiate request
    $user = new User($db);

    $user->id = $data->id;

    $user->read_single();
    
    if($data->id == $auth->id && $data->blocked != $user->blocked) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuário não pode bloquear/desbloquear a si próprio.' 
        ]);
        exit;
    }
    
    $user = new User($db);

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