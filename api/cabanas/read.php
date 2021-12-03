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

    // Post query & row count
    $result = $cabana->read();
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $cabanas_arr = [];
        $cabanas_arr['data'] = [];

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $cabana_item = [
                'id' => intval($id),
                'nome' => $nome,
                'tamanho' => $tamanho,
                'quartos' => $quartos,
                'valor_base' => floatval($valor_base),
                'disponivel' => boolval($disponivel),
                'reservada' => boolval($reservada),
                'galeria' => $galeria,
                'id_mapa' => $id_mapa,
                'empreendimento' => [
                    'id' => intval($empre_id),
                    'nome' => $empre_nome,
                ]
            ];

            // Push to data array
            array_push($cabanas_arr['data'], $cabana_item);
        }

        // Encode into JSON & output 
        echo json_encode($cabanas_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'Nenhuma cabana foi encontrada.'
        ]);
    }