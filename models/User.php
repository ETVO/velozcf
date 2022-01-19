<?php

    include_once 'Model.php';
    include_once 'Info.php';
    include_once 'Image.php';
    include_once 'Imobiliaria.php';

    class User extends Model {
        // DB stuff
        private $conn;
        private $table = 'users';

        // Properties
        public $id;
        public $username;
        public $email;
        public $password;
        public $role;
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
                    u.role,
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
                    info.nome_completo ASC
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
        public function read_single($showBlocked = true, $read_imobiliaria = true) {
            // Create query
            $query = "SELECT
                    u.id, 
                    u.username,
                    u.email,
                    u.password,
                    u.role,
                    u.estado_civil,
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
            ";

            $this->id = sanitizeInt($this->id);
            $this->username = sanitizeText($this->username);

            // If id is set, use it to select the user
            if($this->id) {
                $query .= "
                    WHERE
                        u.id = ?
                ";
            }
            // Else, if username is set, use it instead
            else if($this->username) {
                $query .= "
                    WHERE
                        u.username = ?
                ";
            }
            // If nothing is set, the user cannot be found 
            else return false;

            // to show only users that are not blocked
            if(!$showBlocked) {
                $query .= "
                    AND u.blocked = 0
                ";
            }

            $query .= "
                LIMIT 1
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind ID
            if($this->id)
                $stmt->bindParam(1, sanitizeInt($this->id));
            // Bind username
            else if($this->username)
                $stmt->bindParam(1, sanitizeText($this->username));

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
                if($row) {
                    $this->set_properties($row);

                    // read single for foreign keys
                    $this->info->id = $row['info_id'];
                    $this->info->read_single();
                    
                    $this->photo->id = $row['photo_id'];
                    $this->photo->read_single();

                    if($read_imobiliaria){
                        $this->imobiliaria->id = $row['imob_id'];
                        $this->imobiliaria->read_single();
                    }
                
                return true;
            }

            return false;
        }

        // Auth function
        public function authenticate() {

            $password = $this->password;

            if($this->read_single(false) && $this->password === $password) {
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
                    role = IFNULL(:role, DEFAULT(role)),
                    estado_civil = :estado_civil,
                    creci = :creci,
                    blocked = IFNULL(:blocked, DEFAULT(blocked)),
                    info = :info,
                    photo = :photo,
                    imobiliaria = :imobiliaria
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);
            
            // Only follow ahead if info exists and is created
            if($this->info && $this->info->create()) {
                
                $this->imobiliaria->read_single();

                // Sanitize data & Bind params
                $stmt->bindParam(':username', sanitizeText($this->username));
                $stmt->bindParam(':email', sanitizeText($this->email));
                $stmt->bindParam(':password', sanitizeText($this->password));
                $stmt->bindParam(':role', sanitizeText($this->role));
                $stmt->bindParam(':estado_civil', sanitizeText($this->estado_civil));
                $stmt->bindParam(':creci', sanitizeText($this->creci));
                $stmt->bindParam(':blocked', sanitizeBoolean($this->blocked));
    
                $stmt->bindParam(':info', sanitizeInt($this->info->id));
                $stmt->bindParam(':photo', sanitizeInt($this->photo->id));
                $stmt->bindParam(':imobiliaria', sanitizeInt($this->imobiliaria->id));
            }
            else {
                return false;
            }

            // Create row for info
            try {

                // Execute query
                if($stmt->execute()) {
                    $this->id = $this->conn->lastInsertId();
                    return true;
                }

            } catch(Exception $e) {
                $this->sqlstate = $stmt->errorCode();
            }
            
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
                    role = IFNULL(:role, role),
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

            if(!$this->info->update()) return false;

            if($this->id == 1) $this->blocked = 0;

            // Sanitize data & Bind params
            $stmt->bindParam(':username', sanitizeText($this->username));
            $stmt->bindParam(':email', sanitizeText($this->email));
            $stmt->bindParam(':password', sanitizeText($this->password));
            $stmt->bindParam(':role', sanitizeText($this->role));
            $stmt->bindParam(':estado_civil', sanitizeText($this->estado_civil));
            $stmt->bindParam(':creci', sanitizeText($this->creci));
            $stmt->bindParam(':blocked', sanitizeBoolean($this->blocked));

            $stmt->bindParam(':info', sanitizeInt($this->info->id));
            $stmt->bindParam(':photo', sanitizeInt($this->photo->id));
            $stmt->bindParam(':imobiliaria', sanitizeInt($this->imobiliaria->id));
            $stmt->bindParam(':id', sanitizeInt($this->id));
            
            try {
                // Execute query
                if($stmt->execute()) {
                    return true;
                }

            } catch(Exception $e) {
                $this->sqlstate = $stmt->errorCode();
            }

            print_r($stmt->errorInfo());
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