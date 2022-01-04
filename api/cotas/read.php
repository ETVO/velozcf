<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Cota.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $cota = new Cota($db);

    $cota->cabana->id = (isset($_GET['cabana_id'])) ? $_GET['cabana_id'] : null;

    // Post query & row count
    $result = $cota->read();
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $cotas_arr = [];
        $cotas_arr['success'] = true;
        $cotas_arr['data'] = [];

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $cota_item = [
                'id' => intval($id),
                'numero' => intval($numero),
                'valor' => floatval($valor),
                'data_inicio' => $data_inicio,
                'data_fim' => $data_fim,
                'disponivel' => boolval($disponivel),
                'reservada' => boolval($reservada),
                'cabana' => [
                    'id' => intval($cabana_id),
                    'nome' => $cabana_nome,
                ]
            ];

            // Push to data array
            array_push($cotas_arr['data'], $cota_item);
        }

        // Encode into JSON & output 
        echo json_encode($cotas_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'Nenhuma cota foi encontrada.'
        ]);
    }