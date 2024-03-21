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
            
            $data = array(
                'username' => $username,
                'fname' => $fname,
                'age' => $age,
                'dob' => $dob,
                'contact' => $contact
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
