<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Cabana.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cota = new Cabana($db);

    // Get ID from URL
    $cota->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($cota->read_single()) {

        $cota_arr = get_object_vars($cota);
    
        // Make JSON
        print_r(json_encode($cota_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Cota não encontrada.'
        ]);
    }
