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

    $prop->set_properties($data, ['comprador', 'conjuge', 'pagamento', 'empreendimento', 'vendedor', 'unidades']);
    
    $prop->comprador->set_properties($data->comprador);
    $prop->conjuge->set_properties($data->conjuge);
    $prop->pagamento->set_properties($data->pagamento);
    
    $prop->empreendimento->id = $data->empreendimento;
    $prop->vendedor->id = $data->vendedor;

    echo json_encode($data->unidades, JSON_FORCE_OBJECT);

    $prop->unidades = json_encode($data->unidades, JSON_FORCE_OBJECT);

    if($prop->create()) {

        $message = 'Proposta criada com sucesso';
        $success = true;
        $sent = false;

        if($prop->aprovada) {
            $prop->read_single();

            $clicksign = new Clicksign($prop, $db);

            try {
                if($clicksign->create(false)) {
                    $message = 'Proposta enviada com sucesso.';
                    $sent = true;
                    
                    if($prop->update()) {
                        $message = 'Proposta enviada e registrada com sucesso.';
                    }
        
                }
            }
            catch (Exception $e) {
                $message = 'Erro ao enviar proposta.';
                $sent = false;
            }

        }
        
        echo json_encode([
            'data' => [
                'id' => $prop->id
            ],
            'success' => $success,
            'sent' => $sent,
            'message' => $message
        ]);
    }
    else {
        $message = 'Erro ao criar proposta.';

        echo json_encode([
            'success' => false,
            'message' => $message
        ]);

    }