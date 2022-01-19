<?php

    include_once '../../config/setup.php';
include_once '../../config/authenticate.php';
    include_once '../../models/Proposta.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $prop = new Proposta($db);

    // Get ID from URL
    $prop->id = isset($_GET['id']) ? $_GET['id'] : null;
    $prop->document_key = isset($_GET['document_key']) ? $_GET['document_key'] : null;

    // Read single
    if($prop->read_single()) {

        $prop_arr = get_object_vars($prop);
    
        // Make JSON
        print_r(json_encode($prop_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Proposta não encontrada.'
        ]);
    }
