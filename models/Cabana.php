<?php

    include 'Empreendimento.php';

    class Cabana {
        // DB stuff
        private $conn;
        private $table = 'cabanas';

        // Properties
        public $id;
        public $nome;
        public $tamanho;
        public $quartos;
        public $valor_base;
        public $disponivel;
        public $reservada;
        public $id_mapa;
        public $galeria;
        public $empreendimento;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
            $this->empreendimento = new Empreendimento($db);
        }

        // READ
        public function read() {
            // Create query
            $query = "SELECT 
                    c.id, 
                    c.nome,
                    c.tamanho,
                    c.quartos,
                    c.valor_base,
                    c.disponivel,
                    c.reservada,
                    c.galeria,
                    c.id_mapa,
                    e.id as empre_id,
                    e.nome as empre_nome
                FROM 
                    {$this->table} c
                LEFT JOIN 
                    empreendimentos e ON c.empreendimento = e.id
                ORDER BY 
                    c.nome DESC
            ";

            if($this->empreendimento->id) {
                $query .= "
                    WHERE
                        empreendimento = :empreendimento
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
                    id, 
                    nome,
                    tamanho,
                    quartos,
                    valor_base,
                    disponivel,
                    reservada,
                    galeria,
                    id_mapa,
                    empreendimento
                FROM 
                    {$this->table}
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
            // var_dump($row);
            if($row) {
                $this->nome = $row['nome'];
                $this->tamanho = $row['tamanho'];
                $this->quartos = $row['quartos'];
                $this->valor_base = $row['valor_base'];
                
                $this->disponivel = $row['disponivel'];
                $this->reservada = $row['reservada'];
                
                $this->galeria = $row['galeria'];
                $this->id_mapa = $row['id_mapa'];
                
                $this->empreendimento->id = $row['empreendimento'];

                $this->empreendimento = $this->empreendimento->read_single();

                return true;
            }

            return false;
        }

        // CREATE
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET
                    nome = :nome,
                    tamanho = :tamanho,
                    quartos = :quartos,
                    valor_base = :valor_base,
                    disponivel = :disponivel,
                    galeria = :galeria,
                    id_mapa = :id_mapa,
                    empreendimento = :empreendimento
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':tamanho', sanitizeText($this->tamanho));
            $stmt->bindParam(':quartos', sanitizeText($this->quartos));
            $stmt->bindParam(':valor_base', sanitizeFloat($this->valor_base));
            $stmt->bindParam(':disponivel', sanitizeBoolean($this->disponivel));
            $stmt->bindParam(':galeria', sanitizeText($this->galeria));
            $stmt->bindParam(':id_mapa', sanitizeText($this->id_mapa));
            $stmt->bindParam(':empreendimento', sanitizeInt($this->empreendimento->id));
            
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
                    
                    nome = IFNULL(:nome, nome),
                    tamanho = IFNULL(:tamanho, tamanho),
                    quartos = IFNULL(:quartos, quartos),
                    valor_base = IFNULL(:valor_base, valor_base),
                    reservada = IFNULL(:reservada, reservada),
                    disponivel = IFNULL(:disponivel, disponivel),
                    galeria = IFNULL(:galeria, galeria),
                    id_mapa = IFNULL(:id_mapa, id_mapa),
                    empreendimento = IFNULL(:empreendimento, empreendimento)
                WHERE 
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':nome', sanitizeText($this->nome));
            $stmt->bindParam(':tamanho', sanitizeText($this->tamanho));
            $stmt->bindParam(':quartos', sanitizeText($this->quartos));
            $stmt->bindParam(':valor_base', sanitizeFloat($this->valor_base));
            $stmt->bindParam(':reservada', sanitizeBoolean($this->reservada));
            $stmt->bindParam(':disponivel', sanitizeBoolean($this->disponivel));
            $stmt->bindParam(':galeria', sanitizeText($this->galeria));
            $stmt->bindParam(':id_mapa', sanitizeText($this->id_mapa));
            $stmt->bindParam(':empreendimento', sanitizeInt($this->empreendimento->id));
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