<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    
    include_once '../../config/setup.php';
    include_once '../../config/Clicksign.php';
    include_once '../../config/Email.php';
    include_once '../../models/Proposta.php';
    
    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();
    // Instantiate request
    $prop = new Proposta($db);

    $data = json_decode(file_get_contents('php://input'));

    $prop->set_properties($data, ['comprador', 'conjuge', 'pagamento', 'empreendimento', 'vendedor']);
    
    $prop->comprador->set_properties($data->comprador);
    $prop->conjuge->set_properties($data->conjuge);
    $prop->pagamento->set_properties($data->pagamento);
    
    $prop->empreendimento->id = $data->empreendimento;
    $prop->vendedor->id = $data->vendedor;

    if($prop->create()) {

        $message = 'Proposta criada com sucesso';
        $success = true;
        $sent = false;

        if($prop->aprovada) {

            $prop->empreendimento->read_single();
            $prop->vendedor->read_single();

            $clicksign = new Clicksign($prop);

            if($clicksign->create()) {
                $prop->sign_url = $clicksign->sign_url ?? '';
                $message = 'A proposta não foi enviada, contate um administrador.';
    
                try {
                    $email = new Email();
        
                    $email->mail->addAddress('minimalq.web@gmail.com', 'MinimalQ');
                    $email->mail->addAddress($prop->email, $prop->comprador->nome_completo);
                    // $email->mail->addAddress($prop->vendedor->email, $prop->vendedor->info->nome_completo);
                    // $email->mail->addAddress('coord.imobmark@gmail.com', 'Imobmark');
        
                    $email->mail->Subject = 'Proposta - Sistema Veloz';
                    $email->mail->Body = 'A proposta foi recebida e aprovada. Para assiná-la, acesse o link: ' . $prop->sign_url;
    
                    $email->send();
    
                    $message = 'Proposta enviada com sucesso.';
                    $sent = true;
                } catch (Exception $e) {
                
                    $message = 'A proposta não foi enviada, contate um administrador.';
                }
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