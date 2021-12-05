<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/setup.php';
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

        $cota_arr = [
            'id' => intval($cota->id),
            'numero' => intval($cota->numero),
            'valor' => floatval($cota->valor),
            'data_inicio' => $cota->data_inicio,
            'data_fim' => $cota->data_fim,
            'disponivel' => boolval($cota->disponivel),
            'reservada' => boolval($cota->reservada),
            'cabana' => [
                'id' => intval($cota->cabana->id),
                'nome' => $cota->cabana->nome,
            ]
        ];
    
        // Make JSON
        print_r(json_encode($cota_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Cota não encontrada.'
        ]);
    }
