<?php

    // Include the MongoDB PHP library
    require_once __DIR__ . '/../vendor/autoload.php';

    // Establish connection to MongoDB server
    $databaseConnection = new MongoDB\Client;

    // Select database
    $myDatabase = $databaseConnection->user_profile;

    // Select a collection
    $userCollection = $myDatabase->profiles;

    if($userCollection){
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'];
            $fname = $_POST['fname'];
            $age = $_POST['age'];
            $dob = $_POST['dob'];
            $contact = $_POST['contact'];

            require 'login.php';
            $objUser = new User();  // user modal
            // Retrieve user record based on username
            $existingUser = $objUser->getUserByUsername($username);

            $email = $existingUser["email"];
            
            
            $data = array(
                'username' => $username,
                'fname' => $fname,
                'age' => $age,
                'dob' => $dob,
                'contact' => $contact,
                'email' => $email,
            );

            // Inserting data into the collection
            $insertOneResult = $userCollection->insertOne($data);

            if($insertOneResult) {
                echo json_encode(["status" => "info", "out" => "success", "msg" => "<b>SUCCESS : </b> Data successfully uploaded"]);
            }
            else {
                echo json_encode(["status" => "info", "out" => "fail", "msg" => "<b>ERROR : </b> Error in uploading data"]);
            }
        }
    }
    else {
        echo "Failed to connectz";
    }
    
?>
