<?php

    class Imobiliaria {
        // DB stuff
        private $conn;
        private $table = 'imobiliarias';

        // Properties
        public $id;
        public $nome;
        public $cnpj;
        public $endereco;
        public $bairro;
        public $cep;
        public $cidade;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
        }

        // READ
        public function read() {
            // Create query
            $query = "SELECT 
                    id, 
                    nome,
                    cnpj,
                    endereco,
                    bairro,
                    cep,
                    cidade,
                    updated_at
                FROM 
                    {$this->table}
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
                    id, 
                    nome,
                    cnpj,
                    endereco,
                    bairro,
                    cep,
                    cidade,
                    updated_at
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
                $this->nome = $row['nome'];
                $this->cnpj = $row['cnpj'];
                $this->endereco = $row['endereco'];
                $this->bairro = $row['bairro'];
                $this->cep = $row['cep'];
                $this->cidade = $row['cidade'];
                $this->updated_at = $row['updated_at'];
                
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
                    endereco = :endereco,
                    bairro = :bairro,
                    cep = :cep,
                    cidade = :cidade,
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':cnpj', sanitizeText($this->cnpj));
            $stmt->bindParam(':endereco', sanitizeText($this->endereco));
            $stmt->bindParam(':bairro', sanitizeText($this->bairro));
            $stmt->bindParam(':cep', sanitizeText($this->cep));
            $stmt->bindParam(':cidade', sanitizeText($this->cidade));
            
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
                    endereco = IFNULL(:endereco, endereco),
                    bairro = IFNULL(:bairro, bairro),
                    cep = IFNULL(:cep, cep),
                    cidade = IFNULL(:cidade, cidade),
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':cnpj', sanitizeText($this->cnpj));
            $stmt->bindParam(':endereco', sanitizeText($this->endereco));
            $stmt->bindParam(':bairro', sanitizeText($this->bairro));
            $stmt->bindParam(':cep', sanitizeText($this->cep));
            $stmt->bindParam(':cidade', sanitizeText($this->cidade));
            
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