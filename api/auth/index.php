<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include '../../config/Database.php';
    include '../../config/Auth.php';
    
    $auth_db = new Database();
    $auth = new Auth($_SERVER['REQUEST_METHOD'], $auth_db->connect());
    $auth->setUser($_SERVER['PHP_AUTH_USER']);
    $auth->setPass($_SERVER['PHP_AUTH_PW']);
    $auth_db->close();

    $user = $auth->authenticate(false);

    if($user) {
        $user_arr = get_object_vars($user);
    
        // Make JSON
        print_r(json_encode($user_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário inexistente ou senha inválida.'
        ]);
    }