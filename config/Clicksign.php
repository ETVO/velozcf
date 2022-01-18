<?php

include_once __DIR__ . '/CurlPost.php';
include_once __DIR__ . '../models/Config.php';

define("CREATE_SIGNER_URL", "https://sandbox.clicksign.com/api/v1/signers?access_token=65291441-eb58-4583-890a-eb8a4632b985");
define("CREATE_DOC_URL", "https://sandbox.clicksign.com/api/v1/templates/76f19bab-384b-4ede-925c-f8e1a84ec0c8/documents?access_token=65291441-eb58-4583-890a-eb8a4632b985");
define("SIGNER_TO_DOC_URL", "https://sandbox.clicksign.com/api/v1/lists?access_token=65291441-eb58-4583-890a-eb8a4632b985");

class Clicksign
{
    private $conn;

    public $sign_url;
    private $document_key;
    private $comprador_key;
    private $proposta;
    private $vars_excluded = ['sqlstate', 'updated_at', 'password', 'photo', 'logo', 'cover', 'unidades', 'id'];

    public function __construct($proposta, $db)
    {
        $this->proposta = $proposta;

        $this->conn = $db;
    }

    public function create() {
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

        if($this->create_model($repcf, $testemunha)) {
            // Add Comprador to sign document
            $comprador_key = $this->create_signer(
                $this->proposta->email,
                $this->proposta->comprador->nome_completo,
                $this->proposta->comprador->cpf,
                $this->proposta->comprador->data_nasc
            );
            $this->add_signer_to_doc($comprador_key);
            
            // Add Corretor to sign document
            $vendedor = new User($this->conn);
            $vendedor = $this->proposta->vendedor;

            $vendedor_key = $this->create_signer(
                $vendedor->email,
                $vendedor->info->nome_completo,
                $vendedor->info->cpf,
                $vendedor->info->data_nasc
            );
            $this->add_signer_to_doc($vendedor_key);

            // Check whether Vendedor is associated with an Imobiliaria
            if(isset($vendedor->imobiliaria) && $vendedor->imobiliaria->id != 0) {

                // Add Representante Imobiliaria to sign document
                $rep_imobiliaria = new User($this->conn);
                $rep_imobiliaria = $vendedor->imobiliaria;
    
                $rep_imobiliaria_key = $this->create_signer(
                    $rep_imobiliaria->email,
                    $rep_imobiliaria->info->nome_completo,
                    $rep_imobiliaria->info->cpf,
                    $rep_imobiliaria->info->data_nasc
                );
                $this->add_signer_to_doc($rep_imobiliaria_key);
            }
            
            // Add Representante CF to sign document
            $repcf_key = $this->create_signer(
                $repcf->email,
                $repcf->info->nome_completo,
                $repcf->info->cpf,
                $repcf->info->data_nasc
            );
            $this->add_signer_to_doc($repcf_key);

            // Add Testemunha to sign document
            $testemunha_key = $this->create_signer(
                $testemunha->email,
                $testemunha->info->nome_completo,
                $testemunha->info->cpf,
                $testemunha->info->data_nasc
            );
            $this->add_signer_to_doc($testemunha_key);
        }
    }

    private function get_object_data($obj, $prev_parent = '')
    {
        $encoded = "";
        foreach($obj as $parent => $child) {
            if(is_object($child)) {
                if($prev_parent != '') 
                    $encoded .= $this->get_object_data($child, $prev_parent . "_" . $parent);
                else  
                    $encoded .= $this->get_object_data($child, $parent);
            }
            else {
                if(in_array($child, $this->vars_excluded) 
                || in_array($parent, $this->vars_excluded) 
                || in_array($prev_parent, $this->vars_excluded)) 
                    continue;

                $encoded .= ',"';
                if($prev_parent != '') 
                    $encoded .= $prev_parent . "_"; 
                $encoded .= $parent . '": "' . $child . '"';
            }
        }
        return $encoded;
    }

    private function formatUnidades() {
        $content = "";

        foreach($this->proposta->unidades as $unidade) {
            $content .= " $unidade->nome - ";

            foreach($unidade->cotas as $i => $cota) {
                if($i > 0) $content .= ", ";
                $content .= "Cota $cota->numero";
            }

            $content .= "\n";
        }

        return $content;
    }

    private function create_model($repcf, $testemunha)
    {
        $proposta = (array)$this->proposta;
        $proposta['repcf'] = $repcf;
        $proposta['testemunha'] = $testemunha;
        
        $proposta_data = '{ "data": "'. date('d/m/Y') .'" ' . $this->get_object_data($proposta) . "}";

        $proposta_data = json_decode($proposta_data);
        setlocale(LC_MONETARY, 'pt_BR');
        $money_values = ['pagamento_valor_proposta', 'pagamento_valor_final', 'pagamento_valor_parcela', 'pagamento_entrada'];

        foreach($money_values as $i) {
            $proposta_data->{$i} = number_format($proposta_data->{$i}, 2, ',', '.');
        }

        $proposta_data->unidades = $this->formatUnidades();

        $deadline = new DateTime();
        $deadline->modify('+7 day');

        $url = CREATE_DOC_URL;
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
        return true;
    }

    private function create_signer($email, $nome_completo, $cpf, $data_nasc)
    {
        $url = CREATE_SIGNER_URL;

        $data = [
            "signer" => [
                "email" => $email,
                "auths" => ["email"],
                "name" => $nome_completo,
                "documentation" => $cpf,
                "birthday" => $data_nasc,
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

        $signer_key = json_decode($result)->signer->key;

        return $signer_key;
    }

    private function add_signer_to_doc($signer_key) {
        $url = SIGNER_TO_DOC_URL;

        $data = [
            "list" => [
                "document_key" => $this->document_key,
                "signer_key" => $signer_key,
                "sign_as" => "buyer"
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
}
