<?php

    include_once '../../config/setup.php';
include_once '../../config/authenticate.php';
    include_once '../../models/Proposta.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $prop = new Proposta($db);

    if(isset($_GET['empreendimento'])) {
        $prop->empreendimento->id = $_GET['empreendimento'];
    }

    $showApproved = (isset($_GET['approved'])) ? boolval($_GET['approved']) : true;

    // Post query & row count
    $result = $prop->read($showApproved);
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $props_arr = [];
        $props_arr['data'] = [];
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $prop_item = [
                'id' => intval($id),
                'cidade' => $cidade,
                'telefone' => $telefone,
                'email' => $email,
                'comprador' => [
                    'cpf' => $comprador_cpf,
                    'nome_completo' => $comprador_nome
                ],
                'valor_final' => $valor_final,
                'entrada' => $entrada,
                'desconto' => intval($desconto),
                'empreendimento' => [
                    'id' => $empreendimento_id,
                    'nome' => $empreendimento_nome
                ],
                'vendedor' => [
                    'id' => $vendedor_id,
                    'nome_completo' => $vendedor_nome
                ],
                'updated_at' => $updated_at,
                'aprovada' => boolval($aprovada)
            ];

            // Push to data array
            array_push($props_arr['data'], $prop_item);
        }

        // Encode into JSON & output 
        echo json_encode($props_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'Nenhuma proposta foi encontrada.'
        ]);
    }