<?php

    include_once 'Info.php';
    include_once 'Image.php';
    include_once 'Imobiliaria.php';

    class User {
        // DB stuff
        private $conn;
        private $table = 'users';

        // Properties
        public $id;
        public $username;
        public $email;
        public $password;
        public $estado_civil;
        public $creci;
        public $blocked;
        public $info;
        public $photo;
        public $imobiliaria;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
            $this->info = new Info($db);
            $this->photo = new Image($db);
            $this->imobiliaria = new Imobiliaria($db);
        }

        // READ
        public function read($showBlocked) {
            // Create query
            $query = "SELECT 
                    u.id, 
                    u.username,
                    u.email,
                    u.creci,
                    u.blocked,
                    u.updated_at,
                    info.nome_completo,
                    photo.id as photo_id,
                    photo.url as photo_url,
                    photo.caption as photo_caption,
                    imob.id as imob_id,
                    imob.nome as imob_nome
                FROM 
                    {$this->table} u
                LEFT JOIN 
                    images photo ON u.photo = photo.id
                LEFT JOIN 
                    infos info ON u.info = info.id
                LEFT JOIN 
                    imobiliarias imob ON u.imobiliaria = imob.id
            ";

            if($this->imobiliaria->id) {
                $query .= "
                    WHERE
                        u.imobiliaria = :imobiliaria
                ";

                if(!$showBlocked)
                    $query .= "
                        AND u.blocked = 0
                    ";
            }
            else if(!$showBlocked)
                $query .= "
                    WHERE
                        u.blocked = 0
                ";

            $query .= "
                ORDER BY 
                    u.nome ASC
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);

            if($this->imobiliaria->id) {
                // Bind ID
                // Sanitize data & Bind params
                $stmt->bindParam(':imobiliaria', sanitizeInt($this->imobiliaria->id));
            }

            // Execute statement
            $stmt->execute();

            return $stmt;
        }

        // READ SINGLE
        public function read_single() {
            // Create query
            $query = "SELECT
                    u.id, 
                    u.username,
                    u.email,
                    u.password,
                    u.creci,
                    u.blocked,
                    u.updated_at,
                    info.id as info_id,
                    photo.id as photo_id,
                    photo.url as photo_url,
                    photo.caption as photo_caption,
                    imob.id as imob_id,
                    imob.nome as imob_nome
                FROM 
                    {$this->table} u
                LEFT JOIN 
                    images photo ON u.photo = photo.id
                LEFT JOIN 
                    infos info ON u.info = info.id
                LEFT JOIN 
                    imobiliarias imob ON u.imobiliaria = imob.id
                WHERE
                    u.id = ?
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
                $this->username = $row['username'];
                $this->email = $row['email'];
                $this->password = $row['password'];
                $this->creci = $row['creci'];
                $this->blocked = $row['blocked'];
                $this->updated_at = $row['updated_at'];

                // read single info
                $this->info->id = $row['info_id'];
                $this->info->read_single();
                
                $this->photo->id = $row['photo_id'];
                $this->photo->url = $row['photo_url'];
                $this->photo->caption = $row['photo_caption'];

                $this->imobiliaria->id = $row['imob_id'];
                $this->imobiliaria->nome = $row['imob_nome'];
                
                return true;
            }

            return false;
        }

        // CREATE
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET
                    username = :username,
                    email = :email,
                    password = :password,
                    estado_civil = :estado_civil,
                    creci = :creci,
                    blocked = IFNULL(:blocked, 0),
                    info = :info,
                    photo = :photo,
                    imobiliaria = :imobiliaria
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Create row for info
            if($this->info && $this->info->create()) {
                
                // Sanitize data & Bind params
                $stmt->bindParam(':username', sanitizeText($this->username));
                $stmt->bindParam(':email', sanitizeText($this->email));
                $stmt->bindParam(':password', sanitizeText($this->password));
                $stmt->bindParam(':estado_civil', sanitizeText($this->estado_civil));
                $stmt->bindParam(':creci', sanitizeText($this->creci));
                $stmt->bindParam(':blocked', sanitizeBoolean($this->blocked));
    
                $stmt->bindParam(':info', sanitizeInt($this->info->id));
                $stmt->bindParam(':photo', sanitizeInt($this->photo->id));
                $stmt->bindParam(':imobiliaria', sanitizeInt($this->imobiliaria->id));
                
                // Execute query
                if($stmt->execute()) {
                    $this->id = $this->conn->lastInsertId();
                    return true;
                }

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
                    username = IFNULL(:username, username),
                    email = IFNULL(:email, email),
                    password = IFNULL(:password, password),
                    estado_civil = IFNULL(:estado_civil, estado_civil),
                    creci = IFNULL(:creci, creci),
                    blocked = IFNULL(:blocked, 0),
                    info = IFNULL(:info, info),
                    photo = IFNULL(:photo, photo),
                    imobiliaria = IFNULL(:imobiliaria, imobiliaria)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':username', sanitizeText($this->username));
            $stmt->bindParam(':email', sanitizeText($this->email));
            $stmt->bindParam(':password', sanitizeText($this->password));
            $stmt->bindParam(':estado_civil', sanitizeText($this->estado_civil));
            $stmt->bindParam(':creci', sanitizeText($this->creci));
            $stmt->bindParam(':blocked', sanitizeBoolean($this->blocked));

            $stmt->bindParam(':info', sanitizeInt($this->info->id));
            $stmt->bindParam(':photo', sanitizeInt($this->photo->id));
            $stmt->bindParam(':imobiliaria', sanitizeInt($this->imobiliaria->id));
            
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