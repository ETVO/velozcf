<?php

    include_once 'Info.php';
    include_once 'Pagamento.php';
    include_once 'User.php';
    include_once 'Empreendimento.php';
    include_once 'Model.php';

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
                    compra.nome_completo AS nome_comprador,
                    pag.valor_final,
                    pag.entrada,
                    pag.desconto,
                    emp.nome AS nome_empreendimento,
                    vend_info.nome_completo AS nome_vendedor
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

            if(!$showApproved)
                $query .= "
                    WHERE
                        prop.aprovada = 0
                ";

            $query .= "
                ORDER BY 
                    emp.nome ASC
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);

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
                WHERE
                    id = ?
                LIMIT 1
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(1, sanitizeInt($this->id));

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

    }