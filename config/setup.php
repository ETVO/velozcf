<?php 

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With, Authentication');

    require __DIR__ . '/../vendor/autoload.php';

    include_once __DIR__ . '/functions.php';
    include_once __DIR__ . '/env_constants.php';
    include_once __DIR__ . '/Database.php';