<?php

    include_once 'Model.php';
    include_once 'Cabana.php';

    class Cota extends Model {
        // DB stuff
        private $conn;
        private $table = 'cotas';

        // Properties
        public $id;
        public $numero;
        public $valor;
        public $status;
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
                    cota.status,
                    cabana.id as cabana_id,
                    cabana.numero as cabana_numero
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
                    cota.status,
                    cabana.id as cabana_id,
                    cabana.numero as cabana_numero
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
                $this->set_properties($row);
                                
                $this->cabana->id = $row['cabana_id'];
                $this->cabana->read_single();

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
                    status = IFNULL(:status, 'd'),
                    cabana = :cabana
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':numero', sanitizeText($this->numero));
            $stmt->bindParam(':valor', sanitizeText($this->valor));
            $stmt->bindParam(':status', sanitizeText($this->status));
            $stmt->bindParam(':cabana', sanitizeInt($this->cabana->id));
            
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
                    
                    numero = IFNULL(:numero, numero),
                    valor = IFNULL(:valor, valor),
                    status = IFNULL(:status, status),
                    cabana = IFNULL(:cabana, cabana)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':numero', sanitizeText($this->numero));
            $stmt->bindParam(':valor', sanitizeText($this->valor));
            $stmt->bindParam(':status', sanitizeText($this->status));
            $stmt->bindParam(':cabana', sanitizeInt($this->cabana->id));
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