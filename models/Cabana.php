<?php

    include_once 'Model.php';
    include_once 'Empreendimento.php';
    include_once 'Image.php';

    class Cabana extends Model {
        // DB stuff
        private $conn;
        private $table = 'cabanas';

        // Properties
        public $id;
        public $numero;
        public $disponivel;
        public $id_mapa;
        public $imagem;
        public $galeria;
        public $empreendimento;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
            $this->imagem = new Image($db);
            $this->empreendimento = new Empreendimento($db);
        }

        // READ
        public function read() {
            // Create query
            $query = "SELECT 
                    cabana.id, 
                    cabana.numero,
                    cabana.disponivel,
                    i.id as imagem_id,
                    i.url as imagem_url,
                    i.caption as imagem_caption,
                    cabana.galeria,
                    cabana.id_mapa,
                    e.id as empre_id,
                    e.nome as empre_nome
                FROM 
                    {$this->table} cabana
                LEFT JOIN 
                    images i ON cabana.imagem_id = i.id
                LEFT JOIN 
                    empreendimentos e ON cabana.empreendimento = e.id
            ";

            if($this->empreendimento->id) {
                $query .= "
                    WHERE
                        empreendimento = :empreendimento
                    ORDER BY 
                        cabana.numero
                ";
            }
            else {
                $query .= "
                    ORDER BY 
                        e.nome ASC
                ";
            }


            // Prepare query
            $stmt = $this->conn->prepare($query);

            if($this->empreendimento->id) {
                // Bind ID
                // Sanitize data & Bind params
                $stmt->bindParam(':empreendimento', sanitizeInt($this->empreendimento->id));
            }

            // Execute statement
            $stmt->execute();

            return $stmt;
        }

        // READ SINGLE
        public function read_single() {
            // Create query
            $query = "SELECT
                    c.id, 
                    numero,
                    disponivel,
                    i.id as imagem_id,
                    galeria,
                    id_mapa,
                    empreendimento as empreendimento_id,
                    updated_at
                FROM 
                    {$this->table} c
                LEFT JOIN 
                    images i ON c.imagem_id = i.id
                WHERE
                    c.id = ?
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

                $this->imagem->id = $row['imagem_id'];
                $this->imagem->read_single();

                $this->empreendimento->id = $row['empreendimento_id'];
                $this->empreendimento->read_single();

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
                    disponivel = IFNULL(:disponivel, 1),
                    imagem_id = :imagem_id,
                    galeria = :galeria,
                    id_mapa = :id_mapa,
                    empreendimento = :empreendimento
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':numero', sanitizeInt($this->numero));
            $stmt->bindParam(':disponivel', sanitizeBoolean($this->disponivel));
            $stmt->bindParam(':imagem_id', sanitizeInt($this->imagem->id));
            $stmt->bindParam(':galeria', sanitizeText($this->galeria));
            $stmt->bindParam(':id_mapa', sanitizeText($this->id_mapa));
            $stmt->bindParam(':empreendimento', sanitizeInt($this->empreendimento->id));
            
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
                    disponivel = IFNULL(:disponivel, disponivel),
                    imagem_id = IFNULL(:imagem_id, imagem_id),
                    galeria = IFNULL(:galeria, galeria),
                    id_mapa = IFNULL(:id_mapa, id_mapa),
                    empreendimento = IFNULL(:empreendimento, empreendimento)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':numero', sanitizeText($this->numero));
            $stmt->bindParam(':disponivel', sanitizeBoolean($this->disponivel));
            $stmt->bindParam(':imagem_id', sanitizeText($this->imagem->id));
            $stmt->bindParam(':galeria', sanitizeText($this->galeria));
            $stmt->bindParam(':id_mapa', sanitizeText($this->id_mapa));
            $stmt->bindParam(':empreendimento', sanitizeInt($this->empreendimento->id));
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