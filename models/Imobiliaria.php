<?php

    include_once 'Model.php';
    include_once 'Info.php';

    class Imobiliaria extends Model {
        // DB stuff
        private $conn;
        private $table = 'imobiliarias';

        // Properties
        public $id;
        public $nome;
        public $cnpj;
        public $crecij;
        public $rep_email;
        public $rep_estado_civil;
        public $rep_creci;
        public $rep_info;
        public $endereco;
        public $bairro;
        public $cep;
        public $cidade;
        public $user_count;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
            $this->rep_info = new Info($db);
        }

        // READ
        public function read() {
            // Create query
            $query = "SELECT 
                    i.id, 
                    nome,
                    cnpj,
                    crecij,
                    rep_email,
                    rep_estado_civil,
                    rep_creci,
                    rep_info,
                    info.nome_completo as rep_nome_completo,
                    endereco,
                    bairro,
                    cep,
                    cidade,
                    i.updated_at,
                    COUNT(u.id) AS user_count
                FROM 
                    {$this->table} i
                LEFT JOIN
                    users u ON u.imobiliaria = i.id
                LEFT JOIN
                    infos info ON i.rep_info = info.id
                GROUP BY
                    i.id
                ORDER BY 
                    nome ASC
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
                    i.id, 
                    i.nome,
                    cnpj,
                    crecij,
                    rep_email,
                    rep_estado_civil,
                    rep_creci,
                    rep_info as rep_info_id,
                    endereco,
                    bairro,
                    cep,
                    cidade,
                    i.updated_at,
                    COUNT(u.id) AS user_count
                FROM 
                    {$this->table} i
                INNER JOIN
                    users u ON u.imobiliaria = i.id
                WHERE
                    i.id = ?
                LIMIT 1
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind ID
            $stmt->bindParam(1, sanitizeInt($this->id));

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                if(!isset($this->id)) $this->id = 0;
                $this->set_properties($row, ['rep_info']);

                $this->rep_info->id = $row['rep_info_id'];
                $this->rep_info->read_single();
                
                return true;
            }

            return false;
        }

        // CREATE
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET 
                    nome = :nome,
                    cnpj = :cnpj,
                    crecij = :crecij,
                    rep_email = :rep_email,
                    rep_estado_civil = :rep_estado_civil,
                    rep_creci = :rep_creci,
                    rep_info = :rep_info,
                    endereco = :endereco,
                    bairro = :bairro,
                    cep = :cep,
                    cidade = :cidade
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);
            
            // Only follow ahead if info exists and is created
            if($this->rep_info && $this->rep_info->create()) {

                // Sanitize data & Bind params
                $stmt->bindParam(':nome', sanitizeText($this->nome));
                $stmt->bindParam(':cnpj', sanitizeText($this->cnpj));
                $stmt->bindParam(':crecij', sanitizeText($this->crecij));
                $stmt->bindParam(':rep_email', sanitizeText($this->rep_email));
                $stmt->bindParam(':rep_estado_civil', sanitizeText($this->rep_estado_civil));
                $stmt->bindParam(':rep_creci', sanitizeText($this->rep_creci));
                
                $stmt->bindParam(':rep_info', sanitizeInt($this->rep_info->id));
                
                $stmt->bindParam(':endereco', sanitizeText($this->endereco));
                $stmt->bindParam(':bairro', sanitizeText($this->bairro));
                $stmt->bindParam(':cep', sanitizeText($this->cep));
                $stmt->bindParam(':cidade', sanitizeText($this->cidade));
            }

            
            // Execute query
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            // Print error if something goes wrong
            // printf("Error: %s\n", $stmt->err);
            return false;
        }

        // UPDATE
        public function update() {
            // Create query
            $query = "UPDATE {$this->table}
                SET
                    nome = IFNULL(:nome, nome),
                    cnpj = IFNULL(:cnpj, cnpj),
                    crecij = IFNULL(:crecij, crecij),
                    rep_email = IFNULL(:rep_email, rep_email),
                    rep_estado_civil = IFNULL(:rep_estado_civil, rep_estado_civil),
                    rep_creci = IFNULL(:rep_creci, rep_creci),
                    rep_info = IFNULL(:rep_info, rep_info),
                    endereco = IFNULL(:endereco, endereco),
                    bairro = IFNULL(:bairro, bairro),
                    cep = IFNULL(:cep, cep),
                    cidade = IFNULL(:cidade, cidade)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            if(!$this->rep_info->update()) return false;

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':cnpj', sanitizeText($this->cnpj));
            $stmt->bindParam(':crecij', sanitizeText($this->crecij));
            $stmt->bindParam(':rep_email', sanitizeText($this->rep_email));
            $stmt->bindParam(':rep_estado_civil', sanitizeText($this->rep_estado_civil));
            $stmt->bindParam(':rep_creci', sanitizeText($this->rep_creci));

            $stmt->bindParam(':rep_info', sanitizeInt($this->rep_info->id));

            $stmt->bindParam(':endereco', sanitizeText($this->endereco));
            $stmt->bindParam(':bairro', sanitizeText($this->bairro));
            $stmt->bindParam(':cep', sanitizeText($this->cep));
            $stmt->bindParam(':cidade', sanitizeText($this->cidade));
            
            $stmt->bindParam(':id', sanitizeInt($this->id));
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            // printf("Error: %s\n", $stmt->err);
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

            // Print error if something goes wrong
            // printf("Error: %s\n", $stmt->err);
            return false;
        }

    }