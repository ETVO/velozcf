<?php

include_once __DIR__ . '/CurlPost.php';

class Clicksign
{
    public $sign_url;
    private $document_key;
    private $signer_key;
    private $proposta;
    private $vars_excluded = ['sqlstate', 'updated_at', 'password', 'photo', 'logo', 'cover', 'unidades', 'id'];

    public function __construct($proposta)
    {
        $this->proposta = $proposta;
    }

    public function create() {
        return $this->create_model() && $this->create_signer() && $this->add_signer_to_document();
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

    private function create_model()
    {
        
        $proposta_data = '{ "data": "'. date('d/m/Y') .'" ' . $this->get_object_data($this->proposta) . "}";

        $proposta_data = json_decode($proposta_data);
        setlocale(LC_MONETARY, 'pt_BR');
        $money_values = ['pagamento_valor_proposta', 'pagamento_valor_final', 'pagamento_valor_parcela', 'pagamento_entrada'];

        foreach($money_values as $i) {
            $proposta_data->{$i} = number_format($proposta_data->{$i}, 2, ',', '.');
        }

        $proposta_data->unidades = $this->formatUnidades();

        $url = "https://sandbox.clicksign.com/api/v1/templates/76f19bab-384b-4ede-925c-f8e1a84ec0c8/documents?access_token=65291441-eb58-4583-890a-eb8a4632b985";
        $data = [
            "document" => [
                "path" => "/Veloz/Nova-Proposta-{$this->proposta->id}.docx",
                "template" => [
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

    private function create_signer()
    {
        $url = "https://sandbox.clicksign.com/api/v1/signers?access_token=65291441-eb58-4583-890a-eb8a4632b985";

        $data = [
            "signer" => [
                "email" => $this->proposta->email,
                "phone_number" => $this->proposta->telefone,
                "auths" => ["email"],
                "name" => $this->proposta->comprador->nome_completo,
                "documentation" => $this->proposta->comprador->cpf,
                "birthday" => $this->proposta->comprador->data_nasc,
                "has_documentation" => true,
                "selfie_enabled" => true,
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

    private function add_signer_to_document()
    {
        $url = "https://sandbox.clicksign.com/api/v1/lists?access_token=65291441-eb58-4583-890a-eb8a4632b985";

        $data = [
            "list" => [
                "document_key" => $this->document_key,
                "signer_key" => $this->signer_key,
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
