<?php 
    declare(strict_types=1);
    // require_once(__DIR__ . '/../vendor/autoload.php');
    // Dotenv\Dotenv::createImmutable(__DIR__ . '/../')->load();

    // function get_env_var($name) {
    //     return $_ENV[$name];
    // }

    $env = file_get_contents(__DIR__ . '/../.env');

    if($env) {
        $lines = explode(PHP_EOL, $env);

        foreach($lines as $line) {
            [$name, $value] = explode('=', $line);

            $_ENV[$name] = $value;
        }
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
            (!empty($value)) 
            ? htmlspecialchars(strip_tags(strval($value)))
            : null;
    }
    
    function sanitizeInt($value) {
        return 
            (!empty($value)) 
            ? intval(htmlspecialchars(strip_tags(strval($value)))) 
            : null;
    }

    function sanitizeFloat($value) {
        return 
            (!empty($value)) 
            ? floatval(htmlspecialchars(strip_tags(strval($value)))) 
            : null;
    }

    function sanitizeBoolean($value) {
        return 
            ($value !== '') 
            ? floatval(htmlspecialchars(strip_tags(strval($value)))) 
            : null;
    }