<?php

    // Headers
    // header('Access-Control-Allow-Origin: http://velozcf.test');
    // header('Content-Type: application/json');
    // header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT');
    // header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');


    // include '../../config/Database.php';
    // include '../../config/Auth.php';
    
    // $auth_db = new Database();
    // $auth = new Auth($_SERVER['REQUEST_METHOD'], $auth_db->connect());
    // $auth->setUser($_SERVER['PHP_AUTH_USER']);
    // $auth->setPass($_SERVER['PHP_AUTH_PW']);
    // $auth_db->close();

    // $user = $auth->authenticate(false);

    // if($user) {
    //     $user_arr = get_object_vars($user);
    
    //     // Make JSON
    //     print_r(json_encode($user_arr));
    // }
    // else {
    //     echo json_encode([
    //         'success' => false,
    //         'message' => 'Usuário inexistente ou senha inválida.'
    //     ]);
    // }

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

    $user = new User($db);
    
    $data = json_decode(file_get_contents('php://input'));

    $user->set_properties($data);
    
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