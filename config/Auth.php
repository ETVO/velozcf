<?php

    include_once __DIR__ . '/../models/User.php';

    class Auth {
        
        private $request_method;
        private $user;
        private $pass;
        private $conn;

        // roles permissions
        private $POST_roles = ['admin'];
        private $DELETE_roles = ['admin'];
        private $PUT_roles = ['admin', 'geren'];
        private $GET_roles = ['admin', 'geren', 'venda'];

        public function __construct($request_method, $db) {
            $this->request_method = $request_method;
            $this->conn = $db;
        }

        public function setUser($user) {
            $this->user = $user;
        }

        public function setPass($pass, $encrypted = false) {
            if(!$encrypted)
                $this->pass = md5($pass);
            else {
                $this->pass = $pass;
            }
        }

        public function authenticate($echo_json) {

            $valid = false;

            $user = new User($this->conn);

            $user->username = $this->user;

            if($user->read_single(false) && $user->password === $this->pass) {
                switch($this->request_method) {
                    case 'POST':
                        $valid = in_array($user->role, $this->POST_roles);
                        break;
                    case 'DELETE':
                        $valid = in_array($user->role, $this->DELETE_roles);
                        break;
                    case 'PUT':
                        $valid = in_array($user->role, $this->PUT_roles);
                        break;
                    case 'GET':
                        $valid = in_array($user->role, $this->GET_roles);
                        break;
                    default: 
                        $valid = true;
                        break;
                }
            }
            
            if(!$valid) {
                if($echo_json) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Credenciais inválidas ou permissões insuficientes.'
                    ]);
                }

                return false;
            }

            return $user;
        }
    }