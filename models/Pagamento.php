<?php

    include_once 'Model.php';

    class Pagamento extends Model {
        // DB stuff
        private $conn;
        private $table = 'pagamentos';

        // Properties
        public $id;
        public $valor_proposta;
        public $valor_final;
        public $valor_parcela;
        public $n_parcelas;
        public $entrada;
        public $desconto;
        public $meio_pagamento;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
        }

        // READ
        public function read($showBlocked) {
            // Create query
            $query = "SELECT 
                    id,
                    valor_proposta,
                    valor_final,
                    valor_parcela,
                    n_parcelas,
                    entrada,
                    desconto,
                    meio_pagamento
                FROM 
                    {$this->table}
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);

            // Execute statement
            $stmt->execute();

            return $stmt;
        }

        // READ SINGLE
        public function read_single($showBlocked = true) {
            // Create query
            $query = "SELECT
                    id,
                    valor_proposta,
                    valor_final,
                    valor_parcela,
                    n_parcelas,
                    entrada,
                    desconto,
                    meio_pagamento
                FROM 
                    {$this->table}
                WHERE
                    id = ?
                LIMIT 1
            ";

            $this->id = sanitizeInt($this->id);

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(1, sanitizeInt($this->id));

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
                if($row) {
                    $this->set_properties($row);
                
                return true;
            }

            return false;
        }

        // CREATE
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET
                    valor_proposta = :valor_proposta,
                    valor_final = :valor_final,
                    valor_parcela = :valor_parcela,
                    n_parcelas = :n_parcelas,
                    entrada = :entrada,
                    desconto = :desconto,
                    meio_pagamento = :meio_pagamento
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);
            
            // Sanitize data & Bind params
            $stmt->bindParam(':valor_proposta', sanitizeText($this->valor_proposta));
            $stmt->bindParam(':valor_final', sanitizeText($this->valor_final));
            $stmt->bindParam(':valor_parcela', sanitizeText($this->valor_parcela));
            $stmt->bindParam(':n_parcelas', sanitizeText($this->n_parcelas));
            $stmt->bindParam(':entrada', sanitizeText($this->entrada));
            $stmt->bindParam(':desconto', sanitizeText($this->desconto));
            $stmt->bindParam(':meio_pagamento', sanitizeBoolean($this->meio_pagamento));
            
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
                    valor_proposta = IFNULL(:valor_proposta, valor_proposta),
                    valor_final = IFNULL(:valor_final, valor_final),
                    valor_parcela = IFNULL(:valor_parcela, valor_parcela),
                    n_parcelas = IFNULL(:n_parcelas, n_parcelas),
                    entrada = IFNULL(:entrada, entrada),
                    desconto = IFNULL(:desconto, desconto),
                    meio_pagamento = IFNULL(:meio_pagamento, meio_pagamento)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':valor_proposta', sanitizeText($this->valor_proposta));
            $stmt->bindParam(':valor_final', sanitizeText($this->valor_final));
            $stmt->bindParam(':valor_parcela', sanitizeText($this->valor_parcela));
            $stmt->bindParam(':n_parcelas', sanitizeText($this->n_parcelas));
            $stmt->bindParam(':entrada', sanitizeText($this->entrada));
            $stmt->bindParam(':desconto', sanitizeText($this->desconto));
            $stmt->bindParam(':meio_pagamento', sanitizeBoolean($this->meio_pagamento));

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