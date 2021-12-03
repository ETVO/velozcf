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