<?php
    error_reporting(E_ERROR | E_PARSE);
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

            // Query the collection to find the document with the given username
            require 'login.php';
            $userData = $userCollection->findOne(['username' => $username]);

            if($userData) {
                // Calculate age based on date of birth
                $dob = new DateTime($userData['dob']);
                $now = new DateTime();

                // Prepare the response JSON
                $response = [
                    'fname' => $userData['fname'],
                    'dob' => $userData['dob'],
                    'age' => $userData['age'],
                    'contact' => $userData['contact']
                ];

                // Return the response as JSON
                echo json_encode($response);
            }
        }
    }
    else {
        echo "Failed to connectz";
    }


?>