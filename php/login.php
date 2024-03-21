<?php

    class User {
        protected $id;
        protected $username;
        protected $email;
        protected $hashPass;
        protected $activated;
        protected $token;
        protected $createdOn;
        public $conn;

        function setUsername($username) { $this->username = $username; }
        function getUsername() { return $this->username; }
        function setEmail($email) { $this->email = $email; }
        function getEmail() { return $this->email; }
        function setHashPass($hashPass) { $this->hashPass = $hashPass; }
        function getHashPass() { return $this->hashPass; }
        function setActivated($activated) { $this->activated = $activated; }
        function getActivated() { return $this->activated; }
        function setToken($token) { $this->token = $token; }
        function getToken() { return $this->token; }
        function setCreatedOn($createdOn) { $this->createdOn = $createdOn; }
        function getCreatedOn() { return $this->createdOn; }

        function __construct()
        {
        // Setting Database Connection----------------------------------
            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "registration";

            // Create connection
            $this->conn = new mysqli($servername, $username, $password, $dbname);

            // Check connection
            if ($this->conn->connect_error) {
                die("Connection failed: " . $this->conn->connect_error);
            }
        }

        public function registerUser(){

            // Check if email already exists
            $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->bind_param("s", $this->email);
            $stmt->execute();
            $stmt->store_result();
            if (($stmt->num_rows) > 0) {
                $stmt->close();
                $this->conn->close();
                return "email_already_exists"; // Email already exists
            }
            $stmt->close();

            // Check if username already exists
            $stmt = $this->conn->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->bind_param("s", $this->username);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) {
                $stmt->close();
                $this->conn->close();
                return "username_already_exists"; // Username already exists
            }
            $stmt->close();

            $sql = "INSERT INTO `users`(`username`, `email`, `hash_pass`, `activated`, `token`, `created_on`) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sssiss", $this->username, $this->email, $this->hashPass, $this->activated, $this->token, $this->createdOn);
            
            // Execute the prepared statement
            if ($stmt->execute()) {
                $this->conn->close();
                $stmt->close();
                return "user_registered"; //
            } else {
                $stmt->close();
                $this->conn->close();
                return "not_registered";
            }

            // Close statement
            $stmt->close();
            // Close database connection
            $this->conn->close();
        }

        public function getUserByUsername($username) {
            $stmt = $this->conn->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();
            return $user;
        }

        public function setRememberToken($userId, $token) {
            $stmt = $this->conn->prepare("UPDATE users SET token = ? WHERE id = ?");
            $stmt->bind_param("si", $token, $userId);
            $stmt->execute();
            $stmt->close();
        }
    }

?>