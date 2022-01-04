<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Config.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $config = new Config($db);

    // Post query & row count
    $result = $config->read();
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $config_arr = [];
        $config_arr['data'] = [];

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $config_item = [
                'value' => $value,
                'updated_at' => $updated_at
            ];

            // Push to data array
            $config_arr['data'][$name] = $config_item;
        }

        // Encode into JSON & output 
        echo json_encode($config_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'Nenhuma configuração foi encontrada.'
        ]);
    }