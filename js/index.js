$(document).ready(function() {
            // Check if the user is logged in
            var isLoggedIn = localStorage.getItem('isLoggedIn');

            function automatic_login() {
                var username = localStorage.getItem('username');
                var token = localStorage.getItem('sessionToken');

                $.ajax({
                    url: './php/action.php',
                    type: 'POST',
                    dataType: 'json',
                    data: "username="+username+"&action=validate_user_thorugh_token"+"&token="+token,
                    success: function(response) {
                        if (response.status == 'success') {
                            console.log(response.msg);
                            loadProfilePage(); // If all good, redirect to "PROFILE PAGE" --
                        } else {
                            console.log(response.msg);
                            localStorage.clear();
                            // Load the registration page if token not verified :----------
                            loadContent('registration.html');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('ERROR IN CONNECTING TO THE SERVER : ', error);
                        localStorage.clear();
                        loadContent('registration.html');
                    }
                });
            }

            if (isLoggedIn) {
                automatic_login();
            } else {
                localStorage.clear();
                // Load the registration page if not logged in
                loadContent('registration.html');
            }


            // Function to load content dynamically
            function loadContent(url) {
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function(response) {
                        $('body').html(response);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error loading content:', error);
                    }
                });
            }

            // Function to load profile page
            function loadProfilePage() {
                $.ajax({
                    url: 'profile.html',
                    type: 'GET',
                    success: function(response) {
                        $('body').html(response);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error loading profile page:', error);
                    }
                });
            }

        });
