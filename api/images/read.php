<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Image.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $image = new Image($db);

    // Post query & row count
    $result = $image->read();
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $imgs_arr = [];
        $imgs_arr['data'] = [];

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $img_item = [
                'id' => $id,
                'url' => $url,
                'caption' => $caption,
                'size' => $size,
                'updated_at' => $updated_at,
            ];

            // Push to data array
            array_push($imgs_arr['data'], $img_item);
        }

        // Encode into JSON & output 
        echo json_encode($imgs_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'No images found.'
        ]);
    }