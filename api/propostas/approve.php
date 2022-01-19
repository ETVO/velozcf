<?php
    include_once '../../config/setup.php';
    include_once '../../config/authenticate.php';
    include_once '../../config/Clicksign.php';
    include_once '../../config/Email.php';
    include_once '../../models/Proposta.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $prop = new Proposta($db);

    // Get ID from URL
    $prop->id = isset($_GET['id']) ? $_GET['id'] : null;

    // Read single
    if($prop->read_single()) {

        var_dump($prop->aprovada);

        if($prop->aprovada == 0) {
            $message = 'Proposta aprovada com sucesso.';

            $prop->aprovada = 1;

            $prop->update();

            // Reserve the selected cotas (which will be made available again if the deadline is met) 
            $prop->reserve_cotas();

            $clicksign = new Clicksign($prop, $db);

            try {
                if($clicksign->create(true)) {
                    $message = 'Proposta aprovada e enviada com sucesso.';
                    $sent = true;
                    
                    if($prop->update()) {
                        $message = 'Proposta aprovada, enviada e registrada com sucesso.';
                    }
        
                }
            }
            catch (Exception $e) {
                $message = 'Erro ao enviar proposta.';
            }

            echo json_encode([
                'success' => true,
                'message' => $message
            ]);
        }
        else {
            echo json_encode([
                'success' => false,
                'message' => 'Esta proposta já foi aprovada.'
            ]);
        }
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Proposta não encontrada.'
        ]);
    }