<?php 

    include_once __DIR__ . '/Auth.php';
    include_once __DIR__ . '/Database.php';

    // $auth_db = new Database();
    // $auth = new Auth($_SERVER['REQUEST_METHOD'], $auth_db->connect());
    // $auth->setUser($_SERVER['PHP_AUTH_USER']);
    // $auth->setPass($_SERVER['PHP_AUTH_PW']);
    // $auth_db->close();

    // if(!$auth->authenticate(true)) die();