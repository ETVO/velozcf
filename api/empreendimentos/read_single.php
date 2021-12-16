<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/setup.php';
    include_once '../../models/Empreendimento.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $empre = new Empreendimento($db);

    // Get ID from URL
    $empre->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($empre->read_single()) {

        $empre_arr = get_object_vars($empre);
    
        // Make JSON
        print_r(json_encode($empre_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Empreendimento não encontrado.'
        ]);
    }
