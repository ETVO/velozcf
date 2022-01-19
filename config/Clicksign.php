<?php

include_once __DIR__ . '/CurlPost.php';
include_once __DIR__ . '/Email.php';
include_once __DIR__ . '/../models/Config.php';

define("ACCESS_TOKEN", "65291441-eb58-4583-890a-eb8a4632b985");
define("CREATE_SIGNER_URL", "https://sandbox.clicksign.com/api/v1/signers");
define("CREATE_DOC_URL", "https://sandbox.clicksign.com/api/v1/templates/{MODEL_KEY}/documents");
define("SIGNER_TO_DOC_URL", "https://sandbox.clicksign.com/api/v1/lists");
define("MODEL_IMOBILIARIA", "4371cff2-469b-477e-9154-b776925780cf");
define("MODEL_AUTONOMO", "d2aa825a-aa31-4412-869a-5d3c8adcac3d");

class Clicksign
{
    private $conn;

    public $sign_url;
    public $document_key;
    private $comprador_key;
    public $proposta;
    private $vars_excluded = ['sqlstate', 'updated_at', 'password', 'photo', 'logo', 'cover', 'unidades', 'id'];

    public function __construct($proposta, $db)
    {
        $this->proposta = $proposta;

        $this->conn = $db;
    }

    public function create($send_email = true)
    {
        // Get vendedor;
        $vendedor = $this->proposta->vendedor;
        $vendedor->read_single();

        // Check whether Vendedor is associated with an Imobiliaria
        if (isset($vendedor->imobiliaria) && $vendedor->imobiliaria->id != 0) {

            // Add Representante Imobiliaria to sign document
            $rep_imobiliaria = new User($this->conn);
            $rep_imobiliaria = $vendedor->imobiliaria;

            $model_key = MODEL_IMOBILIARIA;
        } else {
            $model_key = MODEL_AUTONOMO;
        }

        // Get Representante CF info from Config
        $config = new Config($this->conn);
        $config->name = 'representante_cf';
        $config->read_single();

        $repcf = new User($this->conn);
        $repcf->id = $config->value;
        $repcf->read_single();

        // Get Testemunha info from Config
        $config = new Config($this->conn);
        $config->name = 'testemunha';
        $config->read_single();

        $testemunha = new User($this->conn);
        $testemunha->id = $config->value;
        $testemunha->read_single();

        if ($this->create_model($repcf, $testemunha, $model_key)) {
            // Add Comprador to sign document
            $signer_comprador = new Signer(
                $this->proposta->email,
                $this->proposta->comprador->nome_completo,
                $this->proposta->comprador->cpf,
                $this->proposta->comprador->data_nasc,
                'buyer'
            );
            $signer_comprador->create_add_send($this->document_key, $send_email);

            // Add Corretor to sign document
            $signer_vendedor = new Signer(
                $vendedor->email,
                $vendedor->info->nome_completo,
                $vendedor->info->cpf,
                $vendedor->info->data_nasc,
                'witness'
            );
            $signer_vendedor->create_add_send($this->document_key, $send_email);

            // Check whether Vendedor is associated with an Imobiliaria
            if (isset($vendedor->imobiliaria) && $vendedor->imobiliaria->id != 0) {

                // Add Representante Imobiliaria to sign document
                $signer_rep_imobiliaria = new Signer(
                    $rep_imobiliaria->email,
                    $rep_imobiliaria->info->nome_completo,
                    $rep_imobiliaria->info->cpf,
                    $rep_imobiliaria->info->data_nasc, 
                    'party'
                );
                $signer_rep_imobiliaria->create_add_send($this->document_key, $send_email);
            }

            // Add Representante CF to sign document
            $signer_repcf = new Signer(
                $repcf->email,
                $repcf->info->nome_completo,
                $repcf->info->cpf,
                $repcf->info->data_nasc,
                'seller'
            );
            $signer_repcf->create_add_send($this->document_key, $send_email);

            // Add Testemunha to sign document
            $signer_testemunha = new Signer(
                $testemunha->email,
                $testemunha->info->nome_completo,
                $testemunha->info->cpf,
                $testemunha->info->data_nasc,
                'witness'
            );
            $signer_testemunha->create_add_send($this->document_key, $send_email);

            return true;
        }
    }

    private function get_object_data($obj, $prev_parent = '')
    {
        $encoded = "";
        foreach ($obj as $parent => $child) {
            if (is_object($child)) {
                if ($prev_parent != '')
                    $encoded .= $this->get_object_data($child, $prev_parent . "_" . $parent);
                else
                    $encoded .= $this->get_object_data($child, $parent);
            } else {
                if (
                    in_array($child, $this->vars_excluded)
                    || in_array($parent, $this->vars_excluded)
                    || in_array($prev_parent, $this->vars_excluded)
                )
                    continue;

                $encoded .= ',"';
                if ($prev_parent != '')
                    $encoded .= $prev_parent . "_";
                $encoded .= $parent . '": "' . $child . '"';
            }
        }
        return $encoded;
    }

    private function formatUnidades()
    {
        $content = "";

        for($i = 0; $i < count($this->proposta->unidades); $i++) {
            $cabana = $this->proposta->unidades[$i];
            $content .= " {$cabana['numero']} - ";

            foreach($cabana['cotas'] as $j => $cota) {
                if ($j > 0) $content .= ", ";
                $content .= "Cota {$cota['numero']}";
            }

            $content .= "\n";
        }

        return $content;
    }

    private function create_model($repcf, $testemunha, $model_key = MODEL_AUTONOMO)
    {
        $proposta_data = clone $this->proposta;
        $proposta_data = (array) $proposta_data;
        $proposta_data['repcf'] = $repcf;
        $proposta_data['testemunha'] = $testemunha;
        $proposta_data = (object) $proposta_data;

        $proposta_data = '{ "data": "' . date('d/m/Y') . '" ' . $this->get_object_data($proposta_data) . "}";

        $proposta_data = json_decode($proposta_data);
        setlocale(LC_MONETARY, 'pt_BR');
        $money_values = ['pagamento_valor_proposta', 'pagamento_valor_final', 'pagamento_valor_parcela', 'pagamento_entrada'];

        foreach ($money_values as $i) {
            $proposta_data->{$i} = number_format($proposta_data->{$i}, 2, ',', '.');
        }

        $proposta_data->unidades = $this->formatUnidades();

        $deadline = new DateTime();
        $deadline->modify('+7 day');
        $deadline = $deadline->format(DATE_W3C);

        $url = str_replace('{MODEL_KEY}', $model_key, CREATE_DOC_URL) . '?access_token=' . ACCESS_TOKEN;
        $data = [
            "document" => [
                "path"          => "/Veloz/Nova-Proposta-{$this->proposta->id}.docx",
                "deadline_at"   => $deadline,
                "template"      => [
                    "data" => $proposta_data
                ]
            ]
        ];

        $options = array(
            'http' => array(
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data)
            )
        );

        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        if ($result === FALSE) {
            return false;
        }

        $this->document_key = json_decode($result)->document->key;

        $this->proposta->document_key = $this->document_key;
        $this->proposta->update();
        return true;
    }
}

class Signer
{

    private $email;
    private $nome_completo;
    private $cpf;
    private $data_nasc;
    private $signer_key;
    private $sign_url;
    private $sign_as;

    public function __construct($email, $nome_completo, $cpf, $data_nasc, $sign_as) {
        $this->email = $email;
        $this->nome_completo = $nome_completo;
        $this->cpf = $cpf;
        $this->data_nasc = $data_nasc;
        $this->sign_as = $sign_as;
    }

    public function create_signer()
    {
        $url = CREATE_SIGNER_URL . '?access_token=' . ACCESS_TOKEN;

        $data = [
            "signer" => [
                "email" => $this->email,
                "auths" => ["email"],
                "name" => $this->nome_completo,
                "documentation" => $this->cpf,
                "birthday" => $this->data_nasc,
                "has_documentation" => true,
                "official_document_enabled" => true,
            ]
        ];

        $options = array(
            'http' => array(
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data)
            )
        );

        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        if ($result === FALSE) {
            return false;
        }

        $this->signer_key = json_decode($result)->signer->key;

        return true;
    }

    public function add_signer_to_doc($document_key)
    {
        $url = SIGNER_TO_DOC_URL . '?access_token=' . ACCESS_TOKEN;

        $data = [
            "list" => [
                "document_key" => $document_key,
                "signer_key" => $this->signer_key,
                "sign_as" => $this->sign_as
            ]
        ];

        $options = array(
            'http' => array(
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data)
            )
        );

        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        if ($result === FALSE) {
            return false;
        }

        $this->sign_url = json_decode($result)->list->url;

        return true;
    }

    public function send_sign_email()
    {
        $email = new Email();

        $email->mail->addAddress($this->email, $this->nome_completo);

        $email->mail->Subject = 'Proposta - Sistema Veloz';
        $email->mail->Body = 'A proposta foi recebida e aprovada. Para assiná-la, acesse o link: ' . $this->sign_url;

        if (!$email->mail->send()) {
            echo $email->mail->ErrorInfo;
            return false;
        }

        return true;
    }

    public function create_add_send($document_key, $send_email = true) {
        $this->create_signer();
        $this->add_signer_to_doc($document_key);
        if($send_email) $this->send_sign_email();
    }
}
