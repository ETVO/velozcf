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
            $stmt->bindParam(1, sanitizeNumber($this->id));

            // Execute stmt
            $stmt->execute();

            // Fetch row & set properties
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
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

            // Sanitize data
            $this->url = sanitizeText($this->url);
            $this->caption = sanitizeText($this->caption);
            $this->size = sanitizeText($this->size);

            $uploaded = false;

            if ($this->url) {
                try {
                    $images_dir = $_ENV['IMAGES_DIR'];
                    $target_dir = __DIR__ . '/../' . $images_dir;

                    [$name, $ext] = explode('.', $this->filename);

                    // "path/to/" . "filename" . ".jpg"
                    $path_to_save = $target_dir . $name . ".$ext";

                    $i = 1;
                    $newname = $name;
                    while (file_exists($path_to_save)) {
                        if (substr($newname, -2) == "_$i") {
                            $i++;
                        } else {
                            $newname = $name . "_$i";
                        }
                        $path_to_save = $target_dir . $newname . ".$ext";
                    }
                    move_uploaded_file($this->url, $path_to_save);
                    $this->url = getDirUrl($path_to_save);
                    $uploaded = true;
                } catch (Exception $e) {
                    return false;
                }
            }

            // Bind params
            $stmt->bindParam(':url', $this->url);
            $stmt->bindParam(':caption', $this->caption);
            $stmt->bindParam(':size', $this->size);

            // Execute query
            if ($uploaded && $stmt->execute()) {
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
                        caption = IFNULL(:caption, caption)
                    WHERE
                        id = :id
                ";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Sanitize data & Bind params
            $stmt->bindParam(':caption', sanitizeText($this->caption));
            $stmt->bindParam(':id', sanitizeNumber($this->id));

            // Execute query
            if ($stmt->execute()) {
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

            $this->id = sanitizeNumber($this->id);

            $deleted = false;

            if($this->id && $this->read_single()) {
                try {
                    $this->url = getUrlDir($this->url);
                    $deleted = unlink($this->url);
                } catch(Exception $e) {
                    return false;
                }
            }
            
            // Sanitize data & Bind params
            $stmt->bindParam(':id', $this->id);

            // Execute query
            if ($deleted && !empty($this->id) && $stmt->execute()) {
                return true;
            }

            // Print error if something goes wrong
            printf("Error: %s\n", $stmt->err);
            return false;
        }
    }
