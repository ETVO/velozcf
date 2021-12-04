<?php

    include_once 'Cabana.php';

    class Cota {
        // DB stuff
        private $conn;
        private $table = 'cotas';

        // Properties
        public $id;
        public $numero;
        public $valor;
        public $data_inicio;
        public $data_fim;
        public $disponivel;
        public $reservada;
        public $cabana;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
            $this->cabana = new Cabana($db);
        }

        // READ
        public function read() {
            // Create query
            $query = "SELECT 
                    cota.id, 
                    cota.numero,
                    cota.valor,
                    cota.data_inicio,
                    cota.data_fim,
                    cota.disponivel,
                    cota.reservada,
                    cabana.id as cabana_id,
                    cabana.nome as cabana_nome
                FROM 
                    {$this->table} cota
                LEFT JOIN 
                    cabanas cabana ON cota.cabana = cabana.id
            ";

            if($this->cabana->id) {
                $query .= "
                    WHERE
                        cota.cabana = :cabana
                ";
            }

            $query .= "
                ORDER BY 
                    cota.numero ASC
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);

            if($this->cabana->id) {
                // Bind ID
                // Sanitize data & Bind params
                $stmt->bindParam(':cabana', sanitizeInt($this->cabana->id));
            }

            // Execute statement
            $stmt->execute();

            return $stmt;
        }

        // READ SINGLE
        public function read_single() {
            // Create query
            $query = "SELECT
                    cota.id, 
                    cota.numero,
                    cota.valor,
                    cota.data_inicio,
                    cota.data_fim,
                    cota.disponivel,
                    cota.reservada,
                    cabana.id as cabana_id,
                    cabana.nome as cabana_nome
                FROM 
                    {$this->table} cota
                LEFT JOIN 
                    cabanas cabana ON cota.cabana = cabana.id
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
                $this->numero = $row['numero'];
                $this->valor = $row['valor'];
                $this->data_inicio = $row['data_inicio'];
                $this->data_fim = $row['data_fim'];
                
                $this->disponivel = $row['disponivel'];
                $this->reservada = $row['reservada'];
                                
                $this->cabana->id = $row['cabana_id'];
                $this->cabana->nome = $row['cabana_nome'];

                return true;
            }

            return false;
        }

        // CREATE
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET
                    numero = :numero,
                    valor = :valor,
                    data_inicio = :data_inicio,
                    data_fim = :data_fim,
                    disponivel = IFNULL(:disponivel, 1),
                    cabana = :cabana
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':numero', sanitizeText($this->numero));
            $stmt->bindParam(':valor', sanitizeText($this->valor));
            $stmt->bindParam(':data_inicio', sanitizeText($this->data_inicio));
            $stmt->bindParam(':data_fim', sanitizeText($this->data_fim));
            $stmt->bindParam(':disponivel', sanitizeBoolean($this->disponivel));
            $stmt->bindParam(':cabana', sanitizeInt($this->cabana->id));
            
            // Execute query
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }

        // UPDATE
        public function update() {
            // Create query
            $query = "UPDATE {$this->table}
                SET
                    
                    numero = IFNULL(:numero, numero),
                    valor = IFNULL(:valor, valor),
                    data_inicio = IFNULL(:data_inicio, data_inicio),
                    data_fim = IFNULL(:data_fim, data_fim),
                    reservada = IFNULL(:reservada, reservada),
                    disponivel = IFNULL(:disponivel, disponivel),
                    cabana = IFNULL(:cabana, cabana)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':numero', sanitizeText($this->numero));
            $stmt->bindParam(':valor', sanitizeText($this->valor));
            $stmt->bindParam(':data_inicio', sanitizeText($this->data_inicio));
            $stmt->bindParam(':data_fim', sanitizeText($this->data_fim));
            $stmt->bindParam(':disponivel', sanitizeBoolean($this->disponivel));
            $stmt->bindParam(':reservada', sanitizeBoolean($this->disponivel));
            $stmt->bindParam(':cabana', sanitizeInt($this->cabana->id));
            $stmt->bindParam(':id', sanitizeInt($this->id));
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
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
            printf("Error: %s\n", $stmt->err);
            return false;
        }

    }