<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Cabana.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cabana = new Cabana($db);

    // Get ID from URL
    $cabana->id = isset($_GET['id']) ? $_GET['id'] : die();

    // Read single
    if($cabana->read_single()) {

        $cabana_arr = [
            'id' => intval($cabana->id),
            'nome' => $cabana->nome,
            'tamanho' => $cabana->tamanho,
            'quartos' => $cabana->quartos,
            'valor_base' => floatval($cabana->valor_base),
            'disponivel' => boolval($cabana->disponivel),
            'reservada' => boolval($cabana->reservada),
            'galeria' => $cabana->galeria,
            'id_mapa' => $cabana->id_mapa,
            'empreendimento' => $cabana->empreendimento
        ];
    
        // Make JSON
        print_r(json_encode($cabana_arr));
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Cabana não encontrada.'
        ]);
    }
