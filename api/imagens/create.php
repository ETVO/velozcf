<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    if(isset($_POST['redirect']))
        header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    
    include_once '../../config/Database.php';
    include_once '../../models/Image.php';
    
    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();
    
    // Instantiate request
    $image = new Image($db);

    $redirect_link = (isset($_POST['redirect'])) ? $_POST['redirect'] : '';

    $image->caption = $_POST['caption'];
    $image->url = $_FILES['file']['tmp_name'];
    $image->size = $_FILES['file']['size'];
    $image->filename = $_FILES['file']['name'];

    if($image->create()) {
        echo json_encode([
            'data' => [
                'id' => $image->id
            ],
            'success' => true,
            'message' => 'Imagem criada com sucesso.'
        ]);
        $redirect_link .= (substr($redirect_link, -1) == '/') ? "$image->id" : "/$image->id";
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar imagem.'
        ]);
    }
    // if(isset($_POST['redirect'])) {
    //     header("Location: $redirect_link");
    // }
    // else {
    //     echo "<script>history.go(-1)</script>";
    // }