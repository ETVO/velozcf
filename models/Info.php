<?php

    include_once 'Model.php';

    class Info extends Model {
        // DB stuff
        private $conn;
        private $table = 'infos';

        // Properties
        public $id;
        public $nome_completo;
        public $nacionalidade;
        public $profissao;
        public $data_nasc;
        public $cpf;
        public $rg;
        public $orgao_exp;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
        }

        // READ
        public function read() {
            // Create query
            $query = "SELECT 
                    id, 
                    nome_completo,
                    nacionalidade,
                    profissao,
                    data_nasc,
                    cpf,
                    rg,
                    orgao_exp
                FROM 
                    {$this->table}
                ORDER BY 
                    nome_completo ASC
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
                    id, 
                    nome_completo,
                    nacionalidade,
                    profissao,
                    data_nasc,
                    cpf,
                    rg,
                    orgao_exp
                FROM 
                    {$this->table}
                WHERE
                    id = ?
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
                $this->nome_completo = $row['nome_completo'];
                $this->nacionalidade = $row['nacionalidade'];
                $this->profissao = $row['profissao'];
                $this->data_nasc = $row['data_nasc'];
                $this->cpf = $row['cpf'];
                $this->rg = $row['rg'];
                $this->orgao_exp = $row['orgao_exp'];
                
                return true;
            }

            return false;
        }

        // CREATE
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET 
                    nome_completo = :nome_completo,
                    nacionalidade = :nacionalidade,
                    profissao = :profissao,
                    data_nasc = :data_nasc,
                    cpf = :cpf,
                    rg = :rg,
                    orgao_exp = :orgao_exp
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome_completo', sanitizeText($this->nome_completo));
            $stmt->bindParam(':nacionalidade', sanitizeText($this->nacionalidade));
            $stmt->bindParam(':profissao', sanitizeText($this->profissao));
            $stmt->bindParam(':data_nasc', sanitizeText($this->data_nasc));
            $stmt->bindParam(':cpf', sanitizeText($this->cpf));
            $stmt->bindParam(':rg', sanitizeText($this->rg));
            $stmt->bindParam(':orgao_exp', sanitizeText($this->orgao_exp));
            
            // Execute query
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            // Print error if something goes wrong
            printf($stmt->errorInfo());
            return false;
        }

        // UPDATE
        public function update() {
            // Create query
            $query = "UPDATE {$this->table}
                SET  
                    nome_completo = IFNULL(:nome_completo, nome_completo),
                    nacionalidade = IFNULL(:nacionalidade, nacionalidade),
                    profissao = IFNULL(:profissao, profissao),
                    data_nasc = IFNULL(:data_nasc, data_nasc),
                    cpf = IFNULL(:cpf, cpf),
                    rg = IFNULL(:rg, rg),
                    orgao_exp = IFNULL(:orgao_exp, orgao_exp)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome_completo', sanitizeText($this->nome_completo));
            $stmt->bindParam(':nacionalidade', sanitizeText($this->nacionalidade));
            $stmt->bindParam(':profissao', sanitizeText($this->profissao));
            $stmt->bindParam(':data_nasc', sanitizeText($this->data_nasc));
            $stmt->bindParam(':cpf', sanitizeText($this->cpf));
            $stmt->bindParam(':rg', sanitizeText($this->rg));
            $stmt->bindParam(':orgao_exp', sanitizeText($this->orgao_exp));
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