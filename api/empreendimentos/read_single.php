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

    // Get ID from URL
    $empre->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($empre->read_single()) {

        $empre_arr = [
            'id' => $empre->id,
            'nome' => $empre->nome,
            'endereco' => $empre->endereco,
            'area_cabana' => $empre->area_cabana,
            'logo' => [
                'id' => $empre->logo->id,
                'url' => $empre->logo->url,
                'caption' => $empre->logo->caption,
            ],
            'cover' => [
                'id' => $empre->cover->id,
                'url' => $empre->cover->url,
                'caption' => $empre->cover->caption,
            ],
            'updated_at' => $empre->updated_at,
            'deleted' => $empre->deleted,
        ];
    
        // Make JSON
        print_r(json_encode($empre_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Empreendimento não encontrado.'
        ]);
    }
