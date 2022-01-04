<?php 

$env = file_get_contents(__DIR__ . '/../.env');

    if($env) {
        $lines = explode(PHP_EOL, $env);
        
        foreach($lines as $line) {
            if(trim($line) != '') {
                if($line[0] == '#') continue;
                [$name, $value] = explode('=', $line);
                
                $_ENV[$name] = $value;
            }
        }
    }
    
    // Set error_reporting after getting the (ENV)IRONMENT variables
    error_reporting(ifset($_ENV['ERROR_REPORTING'], 0));

    function ifset($val, $def) {
        return (isset($val)) ? $val : $def;
    }

    function getDirUrl($path) {
        $realDocRoot = realpath($_SERVER['DOCUMENT_ROOT']);
        $realDirPath = realpath($path);
        $prefix = isset($_SERVER['HTTPS']) ? 'https://' : 'http://';
        $suffix = str_replace($realDocRoot, '', $realDirPath);
        $dirUrl = $prefix . $_SERVER['HTTP_HOST'] . $suffix;
        $dirUrl = str_replace('\\', '/', $dirUrl);
        return $dirUrl;
    }

    function getUrlDir($url) {
        $realDocRoot = realpath($_SERVER['DOCUMENT_ROOT']);
        $prefix = isset($_SERVER['HTTPS']) ? 'https://' : 'http://';
        // $suffix = str_replace($realDocRoot, '', $realDirPath);
        $urlDir = str_replace($prefix . $_SERVER['HTTP_HOST'], $realDocRoot, $url);
        // $dirUrl = $prefix . $_SERVER['HTTP_HOST'] . $suffix;
        // $dirUrl = str_replace('\\', '/', $dirUrl);
        return $urlDir;
    }

    function sanitizeText($value) {
        return 
            (isset($value) && strlen($value)) 
            ? htmlspecialchars(strip_tags(strval($value)))
            : null;
    }

    function sanitizeJSON($value) {
        return 
            (isset($value) && strlen($value)) 
            ? strip_tags(strval($value))
            : null;
    }
    
    function sanitizeInt($value) {
        return 
            (isset($value) && strlen($value)) 
            ? intval(htmlspecialchars(strip_tags(strval($value)))) 
            : null;
    }

    function sanitizeFloat($value) {
        return 
            (isset($value) && strlen($value)) 
            ? floatval(htmlspecialchars(strip_tags(strval($value)))) 
            : null;
    }

    function sanitizeBoolean($value) {
        return 
            (isset($value) && strlen($value))  
            ? floatval(htmlspecialchars(strip_tags(strval($value)))) 
            : null;
    }

    function auth_user($username, $password, $db, $roles = [], $echo_and_exit = true) {
        $user = new User($db);
        
        $user->username = $username;
        $user->password = $password;

        if($user->authenticate()) {
            
            if(count($roles) > 0) {
                if(in_array($user->role, $roles)) {
                    return $user;
                } 
                else {
                    if($echo_and_exit) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Permissões insuficientes.'
                        ]);
                        exit;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return $user;
            }
        }
        else {
            if($echo_and_exit) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Usuário inexistente ou senha incorreta.'
                ]);
                exit;
            }
            else {
                return false;
            }
        }
    }