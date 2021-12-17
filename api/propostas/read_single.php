<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/setup.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $user = new User($db);

    // Get ID from URL
    $user->id = isset($_GET['id']) ? $_GET['id'] : null;
    $user->username = isset($_GET['username']) ? $_GET['username'] : null;

    // Read single
    if($user->read_single()) {

        $user_arr = get_object_vars($user);
    
        // Make JSON
        print_r(json_encode($user_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário não encontrado.'
        ]);
    }
