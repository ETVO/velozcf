<?php
    include_once "functions.php";
    include_once "env_constants.php";

    class Database {
        // DB params
        private $host = DB_HOST;
        private $dbname = DB_NAME;
        private $username = DB_USER;
        private $password = DB_PASSWORD;
        private $conn;

        public function __construct() {
        }

        // DB connect
        public function connect() {
            $this->conn = null;
            try {
                // Start connection
                $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->dbname, 
                    $this->username, $this->password);

                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            } catch(PDOException $e) {
                echo 'Connection error: ' . $e->getMessage();
            }

            return $this->conn;
        }
    }