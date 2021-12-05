<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Imobiliaria.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $imob = new Imobiliaria($db);

    // Post query & row count
    $result = $imob->read();
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $imobs_arr = [];
        $imobs_arr['data'] = [];
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {

            // Push to data array
            array_push($imobs_arr['data'], $row);
        }

        // Encode into JSON & output 
        echo json_encode($imobs_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'Nenhuma imobiliária foi encontrada.'
        ]);
    }