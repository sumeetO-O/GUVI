<?php
    error_reporting(E_ERROR | E_PARSE);
    
    if (isset($_GET['action']) && ($_GET['action'] == 'fetch')) {
        // Include the MongoDB PHP library
        require_once __DIR__ . '/../vendor/autoload.php';

        // Establish connection to MongoDB server
        $databaseConnection = new MongoDB\Client;

        // Select database
        $myDatabase = $databaseConnection->user_profile;

        // Select a collection
        $userCollection = $myDatabase->profiles;

        if($userCollection){
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $username = $_GET['username'];
                $token = $_GET['token'];

                if (true) {
                    // Proceed with fetching user data
                    // Query the collection to find the document with the given username
                    $userData = $userCollection->findOne(['username' => $username]);

                    if($userData) {
                        // Calculate age based on date of birth
                        $dob = new DateTime($userData['dob']);
                        $now = new DateTime();
                        $email = null;


                        // Prepare the response JSON
                        $response = [
                            'fname' => $userData['fname'],
                            'dob' => $userData['dob'],
                            'age' => $userData['age'],
                            'contact' => $userData['contact'],
                            'email' => $userData['email'],
                            'address' => $userData['address'],
                            'postcode' => $userData['postcode'],
                            'state' => $userData['state'],
                            'country' => $userData['country'],
                            'education' => $userData['education'],
                            'description' => $userData['description']
                        ];

                        // Return the response as JSON
                        echo json_encode($response);
                    }
                } else {
                    // Handle invalid username or token
                    echo json_encode(["error" => "Invalid username or token"]);
                }

                
            }
        }
        else {
            echo "Failed to connectz";
        }
    }

    if(isset($_GET['action']) && ($_GET['action'] == 'logout')) {
        $username = $_GET['username'];

        require 'login.php';
        $objUser = new User();  // user modal
        $existingUser = $objUser->getUserByUsername($username);
        $objUser->setRememberToken($existingUser["id"], null);

        echo json_encode(["status" => "success", "msg" => "<b>LOGGING OUT!</b> See you soon!"]);
    }


?>