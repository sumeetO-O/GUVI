<?php

require_once __DIR__ . '/../vendor/autoload.php';
require 'login.php';

use Predis\Client;

// SO now i am initializing Redis client
$redis = new Client();

$response = ["status" => "", "msg" => ""];
function isValidUsername($username) {
    return preg_match('/^[a-zA-Z0-9_]{1,20}$/', $username);
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if(isset($_POST['action']) && ($_POST['action'] == 'validate_user_thorugh_token')) {
        $username = $_POST['username'];
        $token = $_POST['token'];

        if(userValidate($username, $token)) {
            $response = json_encode(["status" => "success", "msg" => "User Validated"]);
        }
        else {
            $response = json_encode(["status" => "error", "msg" => "User Not Validated (Token does not match the user's data)"]);
        }

        echo $response;
    }

    if(isset($_POST['action']) && ($_POST['action'] == 'register')) {
        $user = validateRegForm();

        // Hash the password
        $hashed_password = password_hash($user["pass"], PASSWORD_DEFAULT);


        $objUser = new User();
        $objUser->setUsername($user['username']);
        $objUser->setEmail($user['email']);
        $objUser->setHashPass($hashed_password);
        $objUser->setActivated(0);
        $objUser->setToken(NULL);
        $objUser->setCreatedOn(date('Y-m-d H:i:s'));

        // Register the user
        $registerResult = $objUser->registerUser();

        if($registerResult == "email_already_exists") {
            $response = ["status" => "warning", "msg" => "Email already exists"];
        }
        else if($registerResult == "username_already_exists") {
            $response = ["status" => "error", "msg" => "<b>Oops! </b>Username already exists (Try Something Else)"];
        }
        else if($registerResult == "user_registered") {
            $response = ["status" => "success", "msg" => "User registered successfully 🥳"];
        }
        else if($registerResult == "not_registered") {
            $response = ["status" => "info", "msg" => "Something went wrong. Please try again"];
        }
        

        // Return response as JSON
        echo json_encode($response);
    }

    if(isset($_POST['action']) && ($_POST['action'] == 'login')) {
        $user = validateLoginForm();
        $objUser = new User();

        // Retrieve user record based on username
        $existingUser = $objUser->getUserByUsername($user["username"]);
        
        if (!$existingUser) {
            // User does not exist
            $response = ["status" => "info", "msg" => "<b>ERROR : </b> Invalid username"];
        } else {
            // Verify password
            if (password_verify($user["pass"], $existingUser["hash_pass"])) {
                // Password is correct, login successful
                $response = ["username" => $existingUser["username"], "status" => "success", "msg" => "Login successful"];

                // Check if Remember Me is checked
                if (isset($_POST['remember'])) {
                    // Creating session data
                    $sessionData = [
                        "username" => $existingUser["username"],
                        // Add other session data as needed
                    ];

                    // Generate a unique session ID
                    $token = bin2hex(random_bytes(32));

                    // Set session data in Redis
                    $redis->setex("token:$token", 86400, json_encode($sessionData)); // Session expires in 24 hours (86400 seconds)

                    // Set session ID in a cookie
                    setcookie("token", $token, time() + 86400, "/"); // Cookie expires in 24 hours
                    // Generate a random token
                    
                    // Store the token in the SQL database too (JUST)
                    $objUser->setRememberToken($existingUser["id"], $token);
                    
                    $response = ["username" => $existingUser["username"], "status" => "success", "msg" => "Login successful", "sessionToken" => $token];
                }
            } else {
                // Password is incorrect
                $response = ["status" => "error", "msg" => "Incorrect password"];
            }
        }

        // Return response as JSON
        echo json_encode($response);
    }
}

// function userValidate($username, $token) {
//     // Create a new User object
//     $user = new User();
    
//     // Get user data by username
//     $userData = $user->getUserByUsername($username);

//     // Check if user data exists and token matches
//     if ($userData && $userData['token'] === $token) {
//         return true; // Username and token match
//     } else {
//         return false; // Username or token does not match
//     }
// }

function userValidate($username, $token) {
    global $redis;

    // Get session data from Redis using the token as key
    $sessionData = $redis->get("token:$token");

    // Check if session data exists and the username matches
    if ($sessionData) {
        $sessionData = json_decode($sessionData, true);
        return $sessionData["username"] === $username;
    }

    return false;
}

function validateLoginForm() {
    $user["username"] = $_POST['username'];
    if(isValidUsername($user["username"]) == false) {
        $response = ["status" => "info", "msg" => "<b>ERROR : </b> Enter valid username"];
        echo json_encode($response);
        exit();
    }

    $user["pass"] = filter_input(INPUT_POST, 'pass', FILTER_UNSAFE_RAW);
    if($user["pass"] == false) {
        $response = ["status" => "info", "msg" => "<b>ERROR : </b> Enter valid password"];
        echo json_encode($response);
        exit();
    }

    return $user;
}
function validateRegForm(){
    $user["username"] = $_POST['username'];
    if(isValidUsername($user["username"]) == false) {
        $response = ["status" => "info", "msg" => "<b>ERROR : </b> Enter valid username"];
        echo json_encode($response);
        exit();
    }

    $user["email"] = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    if($user["email"] == false) {
        $response = ["status" => "info", "msg" => "<b>ERROR : </b> Enter valid email address"];
        echo json_encode($response);
        exit();
    }

    $user["pass"] = filter_input(INPUT_POST, 'pass', FILTER_UNSAFE_RAW);
    if($user["pass"] == false) {
        $response = ["status" => "info", "msg" => "<b>ERROR : </b> Enter valid password"];
        echo json_encode($response);
        exit();
    }

    $user["cfm_pass"] = filter_input(INPUT_POST, 'cfm_pass', FILTER_UNSAFE_RAW);
    if($user["cfm_pass"] == false) {
        $response = ["status" => "info", "msg" => "<b>ERROR : </b> Enter valid confirm password"];
        echo json_encode($response);
        exit();
    }

    if($user["pass"]!= $user["cfm_pass"]) {
        $response = ["status" => "info", "msg" => "<b>ERROR : </b> Passwords and Confirm Password do not match"];
        echo json_encode($response);
        exit();
    }

    return $user;
}
?>