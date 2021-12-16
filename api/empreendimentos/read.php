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

    $showDeleted = (isset($_GET['deleted'])) ? boolval($_GET['deleted']) : true;

    // Post query & row count
    $result = $empre->read($showDeleted);
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $empres_arr = [];
        $empres_arr['data'] = [];

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $empre_item = [
                'id' => intval($id),
                'nome' => $nome,
                'endereco' => $endereco,
                'area_cabana' => $area_cabana,
                'map_slug' => $map_slug,
                'logo' => [
                    'id' => intval($logo_id),
                    'url' => $logo_url,
                    'caption' => $logo_caption,
                ],
                'cover' => [
                    'id' => intval($cover_id),
                    'url' => $cover_url,
                    'caption' => $cover_caption,
                ],
                'updated_at' => $updated_at,
                'deleted' => boolval($deleted),
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