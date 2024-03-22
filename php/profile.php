<?php
    error_reporting(E_ERROR | E_PARSE);
    // Include the MongoDB PHP & Redis library
    require_once __DIR__ . '/../vendor/autoload.php';
    use Predis\Client;

    if (isset($_GET['action']) && ($_GET['action'] == 'fetch')) {

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
        
        // Connect to Redis server (replace '127.0.0.1' and '6379' with your Redis server host and port)
        $redis = new Client([
            'scheme' => 'tcp',
            'host'   => '127.0.0.1',
            'port'   => 6379,
        ]);

        $username = $_GET['username'];

        // Get all keys from Redis matching the pattern 'token:*'
        $keys = $redis->keys("token:*");

        $token = null;
        // Iterate over each key to find the token associated with the username
        foreach ($keys as $key) {
            // Extract the username from the key
            $keyParts = explode(':', $key);
            if ($keyParts[1] === $username) {
                // Found the key associated with the username
                $token = $keyParts[2];
                break;
            }
        }
        if($token){
            // Delete the session data from Redis
            $redis->del($token);
        }

        // For redis server ----
        // Check if the user has a token stored in Redis
        $token = $redis->get("token:$username");
        if ($token) {
            // Delete the token from Redis
            $redis->del("token:$username");
        }



        // FOr SQL Server
        require 'login.php';
        $objUser = new User();  // user modal
        $existingUser = $objUser->getUserByUsername($username);
        $objUser->setRememberToken($existingUser["id"], null);

        echo json_encode(["status" => "success", "msg" => "<b>LOGGING OUT!</b> See you soon!"]);
    }

    if(isset($_POST['action']) && ($_POST['action'] == 'push')) {

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
                // Retrieve username and additional data from POST request
                $username = $_POST['username'];
                $additionalData = array();

                if(isset($_POST['address'])) { $additionalData['address'] = $_POST['address']; }
                if(isset($_POST['postcode'])) { $additionalData['postcode'] = $_POST['postcode']; }
                if(isset($_POST['state'])) { $additionalData['state'] = $_POST['state']; }
                if(isset($_POST['education'])) { $additionalData['education'] = $_POST['education']; }
                if(isset($_POST['country'])) { $additionalData['country'] = $_POST['country']; }
                if(isset($_POST['description'])) { $additionalData['description'] = $_POST['description']; }
                if(isset($_POST['fname'])) { $additionalData['fname'] = $_POST['fname']; }
                if(isset($_POST['dob'])) { $additionalData['dob'] = $_POST['dob']; }
                if(isset($_POST['age'])) { $additionalData['age'] = $_POST['age']; }
                if(isset($_POST['contact'])) { $additionalData['contact'] = $_POST['contact']; }
                if(isset($_POST['email'])) { $additionalData['email'] = $_POST['email']; }


                // Query the collection to find the document with the given username
                $userData = $userCollection->findOne(['username' => $username]);

                if($userData) {
                    // Update the document with additional data
                    $updateResult = $userCollection->updateOne(
                        ['username' => $username],
                        ['$set' => $additionalData]
                    );

                    if($updateResult->getModifiedCount() > 0) {
                        // Data updated successfully
                        echo json_encode(["status" => "success", "msg" => "Data updated successfully 🥳"]);
                    } else {
                        // Failed to update data
                        echo json_encode(["status" => "error", "msg" => "Failed to update the data 😞"]);
                    }
                } else {
                    // User not found
                    echo json_encode(["status" => "info", "msg" => "User not found"]);
                }
            }
        } else {
            echo "Failed to connect to the database";
        }

    }


?>