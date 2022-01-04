<?php
    include_once __DIR__ . '/../models/User.php';
    $ECHO_AND_EXIT = true;

    // Instantiate Database & connect
    $database = new Database();
    $db = $database->connect();

    $user = new User($db);
    
    // Get data from HTTP Authorization Header (Basic token)
    $user->username = $_SERVER['PHP_AUTH_USER'];
    $user->password = $_SERVER['PHP_AUTH_PW'];
    
    if($user->authenticate()) {

        $roles = get_roles($user);
        
        if(isset($roles)) {
            if($roles === true || in_array($user->role, $roles)) {
                return $user;
            } 
            else {
                if($ECHO_AND_EXIT) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Permissões insuficientes.'
                    ]);
                    exit;
                }
                return false;
            }
        }
        else {
            if($ECHO_AND_EXIT) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Permissões insuficientes.'
                ]);
                exit;
            }
            return false;
        }
    }
    else {

        if($ECHO_AND_EXIT) {
            echo json_encode([
                'success' => false,
                'message' => 'Usuário inexistente ou senha incorreta.'
            ]);
            exit;
        }
        return false;
    }

    function get_roles($user) {

        $ADMIN = ['admin'];
        
        /**
         * $ADMIN       => default admin roles
         * 'is_self'    => true if current user is updating or reading itself  
         * true         => all roles
         */
        $privileges = [
            'cabanas' => [
                'create' => $ADMIN,
                'update' => $ADMIN,
                'delete' => $ADMIN,
                'read' => true,
                'read_single' => true,
            ],
            'configs' => [
                'create' => $ADMIN,
                'update' => $ADMIN,
                'delete' => $ADMIN,
                'read' => true,
                'read_single' => true,
            ],
            'cotas' => [
                'create' => $ADMIN,
                'update' => $ADMIN,
                'delete' => $ADMIN,
                'read' => true,
                'read_single' => true,
            ],
            'empreendimentos' => [
                'create' => $ADMIN,
                'update' => $ADMIN,
                'delete' => $ADMIN,
                'read' => true,
                'read_single' => true,
            ],
            'imagens' => [
                'create' => $ADMIN,
                'update' => $ADMIN,
                'delete' => $ADMIN,
                'read' => true,
                'read_single' => true,
            ],
            'imobiliarias' => [
                'create' => $ADMIN,
                'update' => $ADMIN,
                'delete' => $ADMIN,
                'read' => true,
                'read_single' => true,
            ],
            'propostas' => [
                'create' => true,
                'update' => $ADMIN,
                'delete' => $ADMIN,
                'read' => true,
                'read_single' => true,
            ],
            'users' => [
                'create' => $ADMIN,
                'update' => 'is_self',
                'delete' => $ADMIN,
                'read' => $ADMIN,
                'read_single' => 'is_self',
            ],
        ];
    
        // Get request endpoint (users, imagens, etc.) and action (read, delete, etc.)
        $self = $_SERVER['PHP_SELF'];
        
        // $self looks like this: ['', 'api', 'endpoint', 'action.php']
        $self = explode('/', $self);
        
        $endpoint = false;
        $action = false;
        
        // Find endpoint and action inside $self array
        for($i = 0; $i < count($self); $i++) {
            if($self[$i] == 'api') {
                $endpoint = true;
                continue;
            }
    
            if($endpoint === true) {
                $action = true;
                $endpoint = $self[$i];
                continue;
            }
            if($action === true) { 
                $action = basename($self[$i], '.php');;
                break;
            }
        }
        $roles = $privileges[$endpoint][$action];
    
        // If no corresponding roles are found to endpoint and action, 
        // set it to the default admin roles
        if(!isset($roles)) $roles = $ADMIN;

        // If $roles is 'is_self', check if auth user is the same as updated user
        if($roles === 'is_self') {
            $IS_USER_SELF = false;
            
            // If auth user is trying to update or read itself, set $IS_USER_SELF to true
            if($endpoint == 'users') {
                if($action == 'update') {
                    $data = json_decode(file_get_contents('php://input'));
                    
                    $IS_USER_SELF = isset($data) && $user->id === $data->id;
                    
                }
                else if($action == 'read_single') {
                    $IS_USER_SELF = isset($_GET['id']) && $user->id === $_GET['id'];
                }
            }

            // Allow user to update or read itself, otherwise allow only admin roles
            if($IS_USER_SELF) {
                $roles = true;
            }
            else {
                $roles = $ADMIN;
            }
        }

        return $roles;
    }
?>