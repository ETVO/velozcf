<?php

    include 'Image.php';

    class Empreendimento {
        // DB stuff
        private $conn;
        private $table = 'empreendimentos';

        // Properties
        public $id;
        public $nome;
        public $endereco;
        public $area_cabana;
        public $logo;
        public $cover;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
            $this->logo = new Image($db);
            $this->cover = new Image($db);
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
                    e.deleted,
                    e.logo_id,
                    logo.url as logo_url,
                    logo.caption as logo_caption,
                    e.cover_id,
                    cover.url as cover_url,
                    cover.caption as cover_caption
                FROM 
                    {$this->table} e
                LEFT JOIN
                    images logo ON e.logo_id = logo.id
                LEFT JOIN
                    images cover ON e.cover_id = cover.id
                ORDER BY 
                    e.updated_at DESC
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);

            // Execute statement
            $stmt->execute();

            return $stmt;
        }

        // Get single empreendimento
        public function read_single() {
            // Create query
            $query = "SELECT
                    e.id,
                    e.nome,
                    e.endereco,
                    e.area_cabana,
                    e.updated_at,
                    e.deleted,
                    e.logo_id,
                    logo.url as logo_url,
                    logo.caption as logo_caption,
                    e.cover_id,
                    cover.url as cover_url,
                    cover.caption as cover_caption
                FROM 
                    {$this->table} e
                LEFT JOIN
                    images logo ON e.logo_id = logo.id
                LEFT JOIN
                    images cover ON e.cover_id = cover.id
                WHERE
                    e.id = ?
                LIMIT 1
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind ID
            $stmt->bindParam(1, sanitizeNumber($this->id));

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            // var_dump($row);
            if($row) {
                $this->nome = $row['nome'];
                $this->endereco = $row['endereco'];
                $this->area_cabana = $row['area_cabana'];
                
                $this->logo->id = $row['logo_id'];
                $this->logo->url = $row['logo_url'];
                $this->logo->caption = $row['logo_caption'];
                
                $this->cover->id = $row['cover_id'];
                $this->cover->url = $row['cover_url'];
                $this->cover->caption = $row['cover_caption'];
                
                $this->updated_at = $row['updated_at'];
                $this->deleted = $row['deleted'];
                return true;
            }

            return false;
        }

        // Create empreendimento
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET
                    nome = :nome,
                    endereco = :endereco,
                    area_cabana = :area_cabana,
                    logo_id = :logo_id,
                    cover_id = :cover_id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':endereco', sanitizeText($this->endereco));
            $stmt->bindParam(':area_cabana', sanitizeText($this->area_cabana));
            $stmt->bindParam(':logo_id', sanitizeNumber($this->logo->id));
            $stmt->bindParam(':cover_id', sanitizeNumber($this->cover->id));

            // Execute query
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }

        // Update empreendimento
        public function update() {
            // Create query
            $query = "UPDATE {$this->table}
                SET
                    nome = IFNULL(:nome, nome),
                    endereco = IFNULL(:endereco, endereco),
                    area_cabana = IFNULL(:area_cabana, area_cabana),
                    logo_id = IFNULL(:logo_id, logo_id),
                    cover_id = IFNULL(:cover_id, cover_id),
                    deleted = IFNULL(:deleted, deleted)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':endereco', sanitizeText($this->endereco));
            $stmt->bindParam(':area_cabana', sanitizeText($this->area_cabana));
            $stmt->bindParam(':logo_id', sanitizeNumber($this->logo->id));
            $stmt->bindParam(':cover_id', sanitizeNumber($this->cover->id));
            $stmt->bindParam(':deleted', sanitizeBoolean($this->deleted));
            $stmt->bindParam(':id', sanitizeNumber($this->id));
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }

        // Delete empreendimento
        public function delete() {
            
            // Create query
            // $query = "UPDATE {$this->table}
            //     SET
            //         deleted = 1
            //     WHERE 
            //         id = :id
            // ";
            $query = "DELETE FROM {$this->table} WHERE id = :id";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':id', sanitizeNumber($this->id));	

            // Execute query

            if(!empty($this->id) && $stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }

    }