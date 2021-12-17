<?php
    //Import PHPMailer classes into the global namespace
    //These must be at the top of your script, not inside a function
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    class Email {
        public $mail;

        public function __construct() {
            $this->mail = new PHPMailer(true);
            // $this->mail->SMTPDebug = SMTP::DEBUG_SERVER;                  //Enable verbose debug output
            $this->mail->isSMTP();                                        //Send using SMTP
            $this->mail->Host       = $_ENV['SMTP_HOST'];                  //Set the SMTP server to send through
            $this->mail->SMTPAuth   = true;                               //Enable SMTP authentication
            $this->mail->Username   = $_ENV['SMTP_USER'];          //SMTP username
            $this->mail->Password   = $_ENV['SMTP_PASS'];            //SMTP password
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;        //Enable implicit TLS encryption
            $this->mail->Port       = 465;                                //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $this->mail->setFrom('veloz@cfnegocios.com.br', 'Sistema Veloz - CF');
            $this->mail->addReplyTo('veloz@cfnegocios.com.br', 'Sistema Veloz - CF');
        }

        public function send() {
            return $this->mail->send();
        }
    }
