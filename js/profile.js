$(document).ready(() => {
    $username = localStorage.getItem('username');
    $token = localStorage.getItem('token');

    $.ajax({
        url: "./php/profile.php",
        method: 'GET',
        dataType: "json",
        data: "username="+$username,
        success: function(response) {
            console.log(response);
            $("#fname").html(response.fname);
            $("#email").html(response.email);
            $("#contact").html(response.contact);
            $("#age").html(response.age);
            $("#dob").html(response.dob);
        },
        error: function(error) {
            console.log(error);
        }
    });

        $('#logoutBtn').click(function() {
            // Clear the login status from local storage
            localStorage.clear();

            // Redirect to index.html
            window.location.href = 'index.html';
        });
});