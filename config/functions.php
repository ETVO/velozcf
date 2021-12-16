<?php 

    $env = file_get_contents(__DIR__ . '/../.env');

    if($env) {
        $lines = explode(PHP_EOL, $env);

        foreach($lines as $line) {
            if(trim($line) != '') {
                [$name, $value] = explode('=', $line);
    
                $_ENV[$name] = $value;
            }
        }
    }
    
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