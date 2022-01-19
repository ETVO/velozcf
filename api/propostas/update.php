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

    $data = json_decode(file_get_contents('php://input'));

    $prop->id = $data->id;

    $prop->read_single();
    $aprovada_before = $prop->aprovada;
    
    // Create clean instance
    $prop = new Proposta($db);

    $prop->set_properties($data, ['comprador', 'conjuge', 'pagamento', 'empreendimento', 'vendedor', 'unidades']);
    
    $prop->comprador->set_properties($data->comprador);
    $prop->conjuge->set_properties($data->conjuge);
    $prop->pagamento->set_properties($data->pagamento);
    
    $prop->empreendimento->id = $data->empreendimento;
    $prop->vendedor->id = $data->vendedor;

    $prop->unidades = json_encode($data->unidades, JSON_FORCE_OBJECT);
    if(empty($prop->unidades)) $prop->unidades = null;

    if($prop->update()) {
        $message = 'Proposta atualizada.';

        // if(!$aprovada_before) {
        //     $prop->read_single();
    
        //     // Reserve the selected cotas (which will be made available again if the deadline is met) 
        //     $prop->reserve_cotas();

        //     $clicksign = new Clicksign($prop, $db);

        //     try {
        //         if($clicksign->create(true)) {
        //             $message = 'Proposta aprovada e enviada com sucesso.';
        //             $sent = true;
                    
        //             if($prop->update()) {
        //                 $message = 'Proposta aprovada, enviada e registrada com sucesso.';
        //             }
        
        //         }
        //     }
        //     catch (Exception $e) {
        //         $message = 'Erro ao enviar proposta.';
        //     }
        // }

        echo json_encode([
            'success' => true,
            'message' => $message
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar proposta.'
        ]);
    }