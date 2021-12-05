<?php

    include_once 'Model.php';

    class Config extends Model {
        // DB stuff
        private $conn;
        private $table = 'configs';

        // Properties
        public $name;
        public $value;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
        }

        // READ
        public function read() {
            // Create query
            $query = "SELECT 
                    *
                FROM 
                    {$this->table}
                ORDER BY 
                    name ASC
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
                    name = ?
                LIMIT 1
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind ID
            $stmt->bindParam(1, sanitizeText($this->name));

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

        // UPDATE
        public function update() {
            // Create query
            $query = "UPDATE {$this->table}
                SET
                    value = IFNULL(:value, value)
                WHERE 
                    name = :name
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':name', sanitizeText($this->name));
            $stmt->bindParam(':value', sanitizeText($this->value));
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            return false;
        }

        // RESET ALL CONFIGS
        public function resetAll() {
            // Create query
            $query = "DELETE 
                FROM 
                    {$this->table};
                
                INSERT INTO {$this->table} SET name = 'logo', value = '0';
                INSERT INTO {$this->table} SET name = 'cover', value = '0';
                INSERT INTO {$this->table} SET name = 'desconto_max', value = '10';
                INSERT INTO {$this->table} SET name = 'entrada_min', value = '15000';
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            return false;
        }

    }