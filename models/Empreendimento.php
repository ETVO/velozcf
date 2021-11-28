<?php

    class Empreendimento {
        // DB stuff
        private $conn;
        private $table = 'empreendimentos';

        // Properties
        public $id;
        public $nome;
        public $endereco;
        public $area_cabana;
        public $logo_url;
        public $cover_url;
        public $cabanas;
        public $propostas;
        public $updated_at;


        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
        }

        // Get empreendimentos
        public function read() {
            // Create query
            $query = "SELECT 
                    e.id,
                    e.nome,
                    e.endereco,
                    e.area_cabana,
                    e.updated_at,
                    Logo.url as logo_url,
                    Cover.url as cover_url,
                FROM 
                    {$this->tables} e
                LEFT JOIN
                    images Logo ON e.logo_img_id = Logo.id
                LEFT JOIN
                    images Cover ON e.cover_img_id = Cover.id
                ORDER BY 
                    e.created_at DESC
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);

            // Execute statement
            $stmt->execute();

            return $stmt;
        }
    }