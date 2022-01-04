<?php

    include_once '../../config/setup.php';
include_once '../../config/authenticate.php';
    include_once '../../models/Imobiliaria.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $imobiliaria = new Imobiliaria($db);

    // Get ID from URL
    $imobiliaria->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($imobiliaria->read_single()) {

        $imobiliaria_arr = get_object_vars($imobiliaria);
    
        // Make JSON
        print_r(json_encode($imobiliaria_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Imobiliária não encontrada.'
        ]);
    }
