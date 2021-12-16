<?php

    include_once 'Image.php';
    include_once 'Model.php';

    class Empreendimento extends Model {
        // DB stuff
        private $conn;
        private $table = 'empreendimentos';

        // Properties
        public $id;
        public $nome;
        public $endereco;
        public $area_cabana;
        public $map_slug;
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
        public function read($showDeleted = true) {
            // Create query
            $query = "SELECT 
                    e.id,
                    e.nome,
                    e.endereco,
                    e.area_cabana,
                    e.updated_at,
                    e.deleted,
                    e.map_slug,
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
            ";

            if(!$showDeleted)
                $query .= "
                    WHERE 
                        e.deleted = 0
                ";

            $query .= "
                ORDER BY 
                    e.nome DESC
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
                    e.map_slug,
                    e.logo_id,
                    e.cover_id
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
            $stmt->bindParam(1, sanitizeInt($this->id));

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            // var_dump($row);
            if($row) {
                $this->set_properties($row);

                $this->logo->id = $row['logo_id'];
                $this->logo->read_single();
                
                $this->cover->id = $row['cover_id'];
                $this->cover->read_single();

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
                    map_slug = :map_slug,
                    logo_id = :logo_id,
                    cover_id = :cover_id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':endereco', sanitizeText($this->endereco));
            $stmt->bindParam(':area_cabana', sanitizeText($this->area_cabana));
            $stmt->bindParam(':map_slug', sanitizeText($this->map_slug));
            $stmt->bindParam(':logo_id', sanitizeInt($this->logo->id));
            $stmt->bindParam(':cover_id', sanitizeInt($this->cover->id));

            // Execute query
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            // Print error if something goes wrong
            // printf("Error: %s\n", $stmt->err);
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
                    map_slug = IFNULL(:map_slug, map_slug),
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
            $stmt->bindParam(':map_slug', sanitizeText($this->map_slug));
            $stmt->bindParam(':logo_id', sanitizeInt($this->logo->id));
            $stmt->bindParam(':cover_id', sanitizeInt($this->cover->id));
            $stmt->bindParam(':deleted', sanitizeBoolean($this->deleted));
            $stmt->bindParam(':id', sanitizeInt($this->id));
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            // printf("Error: %s\n", $stmt->err);
            return false;
        }

        // Delete empreendimento
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