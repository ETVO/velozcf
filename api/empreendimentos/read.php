<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Empreendimento.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $empre = new Empreendimento($db);

    // Post query & row count
    $result = $empre->read();
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $empres_arr = [];
        $empres_arr['data'] = [];

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $empre_item = [
                'id' => $id,
                'nome' => $nome,
                'endereco' => $endereco,
                'area_cabana' => $area_cabana,
                'logo' => [
                    'id' => $logo_id,
                    'url' => $logo_url,
                    'caption' => $logo_caption,
                ],
                'cover' => [
                    'id' => $cover_id,
                    'url' => $cover_url,
                    'caption' => $cover_caption,
                ],
                'updated_at' => $updated_at,
                'deleted' => $deleted,
            ];

            // Push to data array
            array_push($empres_arr['data'], $empre_item);
        }

        // Encode into JSON & output 
        echo json_encode($empres_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'Nenhum empreendimento foi encontrado.'
        ]);
    }