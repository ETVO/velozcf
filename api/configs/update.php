<?php

    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../models/Config.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $config = new Config($db);

    $data = json_decode(file_get_contents('php://input'));

    $flag = true;

    if($data->resetAll) {
        $flag = $config->resetAll();
    }
    else {
        foreach($data as $key => $value) {
            $config->set_properties($value);
            $config->name = $key;
    
            if(!$config->update()) {
                $flag = false;
                break;   
            }
        }
    }


    if($flag) {
        echo json_encode([
            'success' => true,
            'message' => 'Configurações atualizadas.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar configurações.'
        ]);

    }