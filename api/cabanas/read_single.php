<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Cabana.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cabana = new Cabana($db);

    // Get ID from URL
    $cabana->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($cabana->read_single()) {

        $cabana_arr = get_object_vars($cabana);
    
        // Make JSON
        print_r(json_encode($cabana_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Cabana não encontrada.'
        ]);
    }
