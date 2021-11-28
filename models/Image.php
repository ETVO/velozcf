<?php

    class Image {
        // DB stuff
        private $conn;
        private $table = 'images';

        // Properties
        public $id;
        public $url;
        public $caption;
        public $size;
        public $updated_at;

        // Construct with DB
        public function __construct($db) {
            $this->conn = $db;
        }

        // Get images
        public function read() {
            // Create query
            $query = "SELECT 
                    id,
                    url,
                    caption,
                    size,
                    updated_at
                FROM 
                    {$this->table}
                ORDER BY 
                    updated_at DESC
            ";

            // Prepare query
            $stmt = $this->conn->prepare($query);

            // Execute statement
            $stmt->execute();

            return $stmt;
        }

        // Get single image
        public function read_single() {
            // Create query
            $query = "SELECT 
                    id,
                    url,
                    caption,
                    size,
                    updated_at
                FROM 
                    {$this->table}
                WHERE
                    id = ?
                LIMIT 1
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind ID
            $stmt->bindParam(1, $this->id);

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->id = $row['id'];
                $this->url = $row['url'];
                $this->caption = $row['caption'];
                $this->size = $row['size'];
                $this->updated_at = $row['updated_at'];

                return true;
            }

            return false;

        }

        // Create image
        public function create() {
            // Create query
            $query = "INSERT INTO {$this->table}
                SET
                    url = :url,
                    caption = :caption,
                    size = :size
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean data
            $this->url = ($this->url != '') ? htmlspecialchars(strip_tags($this->url)) : null;
            $this->caption = ($this->caption != '') ?  htmlspecialchars(strip_tags($this->caption)) : null;
            $this->size = ($this->size != '') ? floatval(htmlspecialchars(strip_tags($this->size))) : null;
            
            // Bind params
            $stmt->bindParam(':url', $this->url);
            $stmt->bindParam(':caption', $this->caption);
            $stmt->bindParam(':size', $this->size);
            
            // Execute query
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }

        // Update image
        public function update() {
            // Create query
            $query = "UPDATE {$this->table}
                SET
                    url = IFNULL(:url, url),
                    caption = IFNULL(:caption, caption),
                    size = IFNULL(:size, size)
                WHERE
                    id = :id
            ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean data
            $this->url = ($this->url != '') ? htmlspecialchars(strip_tags($this->url)) : null;
            $this->caption = ($this->caption != '') ?  htmlspecialchars(strip_tags($this->caption)) : null;
            $this->size = ($this->size != '') ? floatval(htmlspecialchars(strip_tags($this->size))) : null;
            $this->id = ($this->id != '') ? floatval(htmlspecialchars(strip_tags($this->id))) : null;
            
            // Bind params
            $stmt->bindParam(':url', $this->url);
            $stmt->bindParam(':caption', $this->caption);
            $stmt->bindParam(':size', $this->size);
            $stmt->bindParam(':id', $this->id);
            
            // Execute query
            if($stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }

        // Delete image
        public function delete() {
            // Create query
            $query = "DELETE FROM {$this->table} WHERE id = :id";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean data
            $this->id = ($this->id != '') ? htmlspecialchars(strip_tags($this->id)) : null;

            // Bind data
            $stmt->bindParam(':id', $this->id);	

            // Execute query

            if(!empty($this->id) && $stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }
    }