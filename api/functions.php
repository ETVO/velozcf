<?php 
    declare(strict_types=1);
    require_once('../vendor/autoload.php');
    Dotenv\Dotenv::createImmutable(__DIR__)->load();

    function authenticate() {
        echo $_ENV['PHPDOTENV'];
    }