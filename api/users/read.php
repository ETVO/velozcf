<?php

    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/User.php';

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate request
    $user = new User($db);

    if(isset($_GET['imobiliaria'])) {
        $user->imobiliaria->id = $_GET['imobiliaria'];
    }

    $showBlocked = (isset($_GET['blocked'])) ? boolval($_GET['blocked']) : true;

    // Post query & row count
    $result = $user->read($showBlocked);
    $num = $result->rowCount();

    // Check if any rows exist
    if($num > 0) {
        // Post array
        $users_arr = [];
        $users_arr['data'] = [];
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $user_item = [
                'id' => intval($id),
                'nome_completo' => $nome_completo,
                'username' => $username,
                'email' => $email,
                'role' => $role,
                'creci' => $creci,
                'blocked' => boolval($blocked),
                'updated_at' => $updated_at,
                'photo' => [
                    'id' => intval($photo_id),
                    'url' => $photo_url,
                    'caption' => $photo_caption
                ],
                'imobiliaria' => [
                    'id' => intval($imob_id),
                    'nome' => $imob_nome,
                ]
            ];

            // Push to data array
            array_push($users_arr['data'], $user_item);
        }

        // Encode into JSON & output 
        echo json_encode($users_arr);
    }
    else {
        // Nothing found
        echo json_encode([
            'success' => false,
            'message' => 'Nenhum usuário foi encontrado.'
        ]);
    }