<?php

    include_once '../../config/setup.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    $user = new User($db);
    
    $data = json_decode(file_get_contents('php://input'));
    
    $user->username = $data->username;
    $user->password = $data->password;

    if($user->authenticate()) {
        $user_arr = get_object_vars($user);
    
        // Make JSON
        print_r(json_encode($user_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário inexistente ou senha incorreta.'
        ]);

    }