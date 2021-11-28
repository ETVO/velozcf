<?php
    declare(strict_types=1);

    require_once('../vendor/autoload.php'); 

    use Firebase\JWT\JWT;

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    

    // extract credentials from request
    $validCredentials = true;

    if($validCredentials) {
        $secretKey  = $_ENV['SECRET_KEY'];
        $issuedAt   = new DateTimeImmutable();
        $expire     = $issuedAt->modify('+1 minutes')->getTimestamp(); // Add 60 seconds
        $serverName = $_ENV['SERVER_NAME'];
        $username   = "username"; // Retrieved from filtered POST data

        $data = [
            'iat'  => $issuedAt->getTimestamp(), // Issued at: time when the token was generated
            'iss'  => $serverName, // Issuer
            'nbf'  => $issuedAt->getTimestamp(), // Not before
            'exp'  => $expire, // Expire
            'userName' => $username, // User name
        ];

        // Encode the array to a JWT string.
        echo JWT::encode(
            $data,
            $secretKey,
            'HS512'
        );
    }