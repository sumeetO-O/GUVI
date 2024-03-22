$(document).ready(() => {

    // Casual Alert Showing Stuffs ------------------------------------------------------------------
    function show_alert(type, msg="RESPONSE", show_time="2000"){
        if(type =='success'){
            $(".alert-success").css("display","block");
            $(".alert-success").addClass("show");
            setTimeout(function () {
                $(".alert-success").removeClass("show");
                setTimeout(()=>{
                    $(".alert-success").css("display","none");
                }, 1000);
            }, show_time);
        }
        else if(type == 'error'){
            $(".alert-danger").css("display","block");
            $(".alert-danger").addClass("show");
            setTimeout(function () {
                $(".alert-danger").removeClass("show");
                setTimeout(()=>{
                    $(".alert-danger").css("display","none");
                }, 1000);
            }, show_time);
        }
        else if(type == 'warning'){
            $(".alert-warning").css("display","block");
            $(".alert-warning").addClass("show");
        }
        else if(type == 'info'){
            $(".alert-info p").html(msg);
            $(".alert-info").css("display","flex");
            $(".alert-info").addClass("show");
            setTimeout(function () {
                $(".alert-info").removeClass("show");
                setTimeout(()=>{
                    $(".alert-info").css("display","none");
                }, 1000);
            }, show_time);
        }
    }

    function responder(response, alert_type, alert_show_time){
        var status = alert_type;
        var msg = response;
        if (status == "success") {
            show_alert("success", msg, alert_show_time);
        }
        else if(status == "error") {
            $("#validationCustomUsername").addClass("is-invalid");
            show_alert("error");
        }
        else if(status == "warning") {
            show_alert("warning");
        }
        else if(status == "info"){
            show_alert("info", msg, alert_show_time);
        }
    }

    // END : Alert functions ends  -----------------------------------------------------


    // Main Concept starts here-------(STARTS FETCHING DATA FROM SERVER RELATED TO USERS, FROM CACHED USERNAME & TOKEN)-------------------------------
    $username = localStorage.getItem('username');
    $token = localStorage.getItem('sessionToken');

    $.ajax({
        url: "./php/profile.php",
        method: 'GET',
        dataType: "json",
        data: "username="+$username+"&action=fetch"+"&token="+$token,
        success: function(response) {
            console.log(response);
            if (response.status != 'error') {
                $("#username").html("@"+$username);
                if(response.email != "" && response.email != null) $("#email").val(response.email);
                if(response.contact != "" && response.contact != null) $("#contact").val(response.contact);
                if(response.age != "" && response.age != null) $("#age").val(response.age);
                if(response.dob != "" && response.dob != null) $("#dob").attr("value", response.dob);
                if(response.address != "" && response.address != null) $("#address").attr("value", response.address);
                if(response.postcode != "" && response.postcode != null) $("#postcode").attr("value", response.postcode);
                if(response.state != "" && response.state != null) $("#state").attr("value", response.state);
                if(response.education != "" && response.education != null) $("#education").attr("value", response.education);
                if(response.country != "" && response.country != null) $("#country").attr("value", response.country);
                if(response.description != "" && response.description != null) $("#description").attr("value", response.description);
                if(response.fname != "" && response.fname != null) $("#fname").val(response.fname);

                $first_name = response.fname.split(" ")[0];
                $("#first_name").html($first_name);

                $("input").each(function() {
                    if ($(this).val() !== "") {
                        $(this).prop("disabled", true);
                    }
                });
            }
            else {
                console.log(response.msg);
            }

        },
        error: function(error) {
            console.log("ERROR IN FETCHING DATA FROM SERVER");
        }
    });

    // SAVE_PROFILE BUTTON FUNCTION -------------------

    $('#save_profile').click(function(e) {
        e.preventDefault();
        // Perform form submission here
        var formData = $("#user_profile_form").serialize();
        console.log(formData);
        $user = localStorage.getItem('username');
        $.ajax({
            url: "./php/profile.php",
            method: 'POST',
            dataType: "json",
            data: formData + "&username=" + $user + "&action=push",
            error: function(xhr, status, error) {
                responder(error, "info", 2000);
            }
        }).done((response) => {
            var data = response;
            responder(data.msg, data.status, 20000);
            if(data.status == "success"){
                console.log(response);
                setTimeout(() => {
                    location.reload(true);
                }, 1000);
            }
        });
    });

    // END ------------------------------------

    // Edit Profile Button --------------------------------

    $("#edit_profile").click((e) => {
        e.preventDefault();
        // Make all the input fields to "disabled = false" --------------------------------
        $("input").each(function() {
            $(this).prop("disabled", false);
        });
    });

    // ----------------------------------------------------


    // LOGOUT BUTTON FUNCTION -------------------
    $('#logoutBtn').click(function(e) {
        e.preventDefault();
        // Clear the login status from local storage
        $username = localStorage.getItem('username');
        localStorage.clear();
        // delete token from server -------------
        $.ajax({
            url: "./php/profile.php",
            method: 'GET',
            dataType: "json",
            data: "action=logout&username=" + $username,
            success: function(response) {
                if (response.status == "success") {
                    responder(response.msg, "info", 1000);
                }
                else {
                    responder("<b> ERROR : </b> There was some error in logging out", "info", 2000);
                }
            },
            error: function(error) {
                responder("COULDN'T ESTABISH CONNECTION WITH SERVER => " + error, "info", 2000);
                console.alert("COULDN'T ESTABISH CONNECTION WITH SERVER");
            }
        });

        // Redirect to index.html
        setTimeout(function() {window.location.href = 'index.html';},1500);
    });
    // END ------------------------------------
});