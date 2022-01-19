<?php

    include_once 'Model.php';
    include_once 'Info.php';
    include_once 'Pagamento.php';
    include_once 'User.php';
    include_once 'Empreendimento.php';
    include_once 'Cota.php';

    class Proposta extends Model {
        // DB stuff
        private $conn;
        private $table = 'propostas';

        // Properties
        public $id;
        public $endereco;
        public $bairro;
        public $cep;
        public $cidade;
        public $telefone;
        public $email;
        public $estado_civil;
        public $regime_casamento;
        public $document_key;
        public $comprador;
        public $conjuge;
        public $unidades;
        public $pagamento;
        public $aprovada;
        public $empreendimento;
        public $vendedor;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
            $this->comprador = new Info($db);
            $this->conjuge = new Info($db);
            $this->pagamento = new Pagamento($db);
            $this->empreendimento = new Empreendimento($db);
            $this->vendedor = new User($db);
        }

        // READ
        public function read($showApproved) {
            // Create query
            $query = "SELECT 
                    prop.id,
                    prop.cidade,
                    prop.telefone,
                    prop.email,
                    prop.aprovada,
                    compra.cpf AS comprador_cpf,
                    compra.nome_completo AS comprador_nome,
                    pag.valor_final,
                    pag.entrada,
                    pag.desconto,
                    emp.id AS empreendimento_id,
                    emp.nome AS empreendimento_nome,
                    vend_info.id AS vendedor_id,
                    vend_info.nome_completo AS vendedor_nome,
                    prop.updated_at
                FROM 
                    {$this->table} prop
                LEFT JOIN 
                    infos compra ON prop.comprador = compra.id
                LEFT JOIN 
                    users vend_user ON prop.vendedor = vend_user.id
                LEFT JOIN 
                    infos vend_info ON vend_user.info = vend_info.id
                LEFT JOIN 
                    pagamentos pag ON prop.pagamento = pag.id
                LEFT JOIN 
                    empreendimentos emp ON prop.empreendimento = emp.id
            ";

            if(!$showApproved) {
                $query .= "
                    WHERE
                        prop.aprovada = 0
                ";
            }
            
            if($this->empreendimento->id) {
                $query .= "
                    WHERE
                        prop.empreendimento = :empreendimento
                ";

                if(!$showApproved)
                    $query .= "
                        AND prop.aprovada = 0
                    ";
            }
            else if(!$showApproved)
                $query .= "
                    WHERE
                        prop.aprovada = 0
                ";

            $query .= "
                ORDER BY 
                    prop.id ASC
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);
            
            if($this->empreendimento->id) {
                // Bind ID
                // Sanitize data & Bind params
                $stmt->bindParam(':empreendimento', sanitizeInt($this->empreendimento->id));
            }

            // Execute statement
            $stmt->execute();

            return $stmt;
        }

        // READ SINGLE
        public function read_single() {
            // Create query
            $query = "SELECT 
                    *
                FROM 
                    {$this->table}
            ";
            $this->id = sanitizeInt($this->id);
            $this->document_key = sanitizeText($this->document_key);

            // If id is set, use it to select the user
            if($this->id) {
                $query .= "
                    WHERE
                        id = ?
                ";
            }
            // Else, if username is set, use it instead
            else if($this->document_key) {
                $query .= "
                    WHERE
                        document_key = ?
                ";
            }
            // If nothing is set, the user cannot be found 
            else return false;

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind ID
            if($this->id)
                $stmt->bindParam(1, sanitizeInt($this->id));
            // Bind document_key
            else if($this->document_key)
                $stmt->bindParam(1, sanitizeText($this->document_key));

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                $this->set_properties($row, ['comprador', 'conjuge', 'pagamento', 'vendedor', 'empreendimento']);

                // read single for foreign keys
                $this->comprador->id = $row['comprador'];
                $this->comprador->read_single();

                if($this->estado_civil == 'Casado') {
                    $this->conjuge->id = $row['conjuge'];
                    $this->conjuge->read_single();
                }

                $this->pagamento->id = $row['pagamento'];
                $this->pagamento->read_single();

                $this->vendedor->id = $row['vendedor'];
                $this->vendedor->read_single();

                $this->empreendimento->id = $row['empreendimento'];
                $this->empreendimento->read_single();

                $this->unidades = json_decode($row['unidades'], true);

                return true;
            }

            return false;
        }

        // CREATE
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET
                    endereco = :endereco,
                    bairro = :bairro,
                    cep = :cep,
                    cidade = :cidade,
                    telefone = :telefone,
                    email = :email,
                    estado_civil = :estado_civil,
                    document_key = :document_key,
                    regime_casamento = :regime_casamento,
                    comprador = :comprador,
                    conjuge = :conjuge,
                    unidades = :unidades,
                    pagamento = :pagamento,
                    aprovada = :aprovada,
                    empreendimento = :empreendimento,
                    vendedor = :vendedor
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);
            
            // Only follow ahead if info exists and is created
            if(
                $this->comprador && $this->comprador->create() &&
                $this->pagamento && $this->pagamento->create()
            ) {
                if($this->estado_civil === 'Casado' && !($this->conjuge && $this->conjuge->create())) {
                    return false;
                }
                // Sanitize data & Bind params
                $stmt->bindParam(':endereco', sanitizeText($this->endereco));
                $stmt->bindParam(':bairro', sanitizeText($this->bairro));
                $stmt->bindParam(':cep', sanitizeText($this->cep));
                $stmt->bindParam(':cidade', sanitizeText($this->cidade));
                $stmt->bindParam(':telefone', sanitizeText($this->telefone));
                $stmt->bindParam(':email', sanitizeText($this->email));
                $stmt->bindParam(':estado_civil', sanitizeText($this->estado_civil));
                $stmt->bindParam(':regime_casamento', sanitizeText($this->regime_casamento));
                $stmt->bindParam(':document_key', sanitizeText($this->document_key));
                $stmt->bindParam(':comprador', sanitizeInt($this->comprador->id));
                $stmt->bindParam(':conjuge', sanitizeInt($this->conjuge->id));
                $stmt->bindParam(':unidades', sanitizeJSON($this->unidades));
                $stmt->bindParam(':pagamento', sanitizeInt($this->pagamento->id));
                $stmt->bindParam(':aprovada', sanitizeText($this->aprovada));
                $stmt->bindParam(':empreendimento', sanitizeInt($this->empreendimento->id));
                $stmt->bindParam(':vendedor', sanitizeInt($this->vendedor->id));
            }
            else {
                return false;
            }

            // Execute query
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            printf($stmt->errorInfo());
            return false;
        }

        // UPDATE
        public function update() {
            // Create query
            $query = "UPDATE {$this->table}
                SET
                    endereco = IFNULL(:endereco, endereco),
                    bairro = IFNULL(:bairro, bairro),
                    cep = IFNULL(:cep, cep),
                    cidade = IFNULL(:cidade, cidade),
                    telefone = IFNULL(:telefone, telefone),
                    email = IFNULL(:email, email),
                    estado_civil = IFNULL(:estado_civil, estado_civil),
                    regime_casamento = IFNULL(:regime_casamento, regime_casamento),
                    document_key = IFNULL(:document_key, document_key),
                    comprador = IFNULL(:comprador, comprador),
                    conjuge = IFNULL(:conjuge, conjuge),
                    unidades = IFNULL(:unidades, unidades),
                    pagamento = IFNULL(:pagamento, pagamento),
                    aprovada = IFNULL(:aprovada, aprovada),
                    empreendimento = IFNULL(:empreendimento, empreendimento),
                    vendedor = IFNULL(:vendedor, vendedor)
                    WHERE 
                        id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            $this->comprador->update();
            $this->conjuge->update();
            $this->pagamento->update();

            // Sanitize data & Bind params
            $stmt->bindParam(':endereco', sanitizeText($this->endereco));
            $stmt->bindParam(':bairro', sanitizeText($this->bairro));
            $stmt->bindParam(':cep', sanitizeText($this->cep));
            $stmt->bindParam(':cidade', sanitizeText($this->cidade));
            $stmt->bindParam(':telefone', sanitizeText($this->telefone));
            $stmt->bindParam(':email', sanitizeText($this->email));
            $stmt->bindParam(':estado_civil', sanitizeText($this->estado_civil));
            $stmt->bindParam(':regime_casamento', sanitizeText($this->regime_casamento));
            $stmt->bindParam(':document_key', sanitizeText($this->document_key));
            $stmt->bindParam(':comprador', sanitizeText($this->comprador));
            $stmt->bindParam(':conjuge', sanitizeText($this->conjuge));
            $stmt->bindParam(':unidades', sanitizeJSON($this->unidades));
            $stmt->bindParam(':pagamento', sanitizeText($this->pagamento));
            $stmt->bindParam(':aprovada', sanitizeText($this->aprovada));
            $stmt->bindParam(':empreendimento', sanitizeText($this->empreendimento));
            $stmt->bindParam(':vendedor', sanitizeText($this->vendedor));

            $stmt->bindParam(':id', sanitizeInt($this->id));
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            return false;
        }

        // DELETE
        public function delete() {
            $query = "DELETE FROM {$this->table} WHERE id = :id";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':id', sanitizeInt($this->id));

            // Execute query
            if(!empty($this->id) && $stmt->execute()) {
                return true;
            }

            return false;
        }

        // UNRESERVE COTAS
        public function change_cotas_status($new_status) {
            $unidades = $this->unidades;

            for($i = 0; $i < count($unidades); $i++) {
                $cabana = $unidades[$i];

                foreach($cabana['cotas'] as $cota) {
                    $new_cota = new Cota($this->conn);
                    $new_cota->set_properties($cota);
                    $new_cota->status = $new_status;
                    $new_cota->update();
                    $cota = $new_cota;
                }
            }

            $this->unidades = $unidades;
        }

        // UNRESERVE COTAS
        public function unreserve_cotas() {
            $this->change_cotas_status('d');
        }

        // RESERVE COTAS
        public function reserve_cotas() {
            $this->change_cotas_status('r');
        }

        // SELL COTAS
        public function sell_cotas() {
            $this->change_cotas_status('v');
        }

    }