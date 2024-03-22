$(document).ready(function () {
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
    // Loop over them and prevent submission if they are not filled correctly
    $(".needs-validation").each(function (form) {
        this.addEventListener('submit', function (event) {
            if (!this.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            this.classList.add('was-validated')
        })
        })

    

    function responder(response, alert_type, alert_show_time){
            var status = alert_type;
            var msg = response;
            if (status == "success") {
                show_alert("success", msg, alert_show_time);
            }
            else if(status == "error") {
                $("#validationCustom02").addClass("is-invalid");
                show_alert("error");
            }
            else if(status == "info"){
                $("#validationCustomUsername").addClass("is-invalid");
                show_alert("info", msg, alert_show_time);
            }
    }

    function check_username_availability(value) {
        return true;
    }
    function validateUsername() {
        var regex = /^[a-zA-Z0-9_]{1,20}$/;
        $val = $('#validationCustomUsername').val();
        if (!regex.test($val)){
            return false;
        }
        else {
            return true;
        }
    }
    $("#validationCustomUsername").on("keyup", () => {
        if(validateUsername()){
            $("#validationCustomUsername").removeClass("is-invalid").addClass("is-valid");
        }
        else {
            $("#validationCustomUsername").addClass("is-invalid");
        }
    });

    function validatePass() {
        pass = $("#validationCustom02").val();
        if (pass != ""){
            $("#validationCustom02").addClass("is-valid").removeClass("is-invalid");
            return true;
        }
        else {
            $("#validationCustom02").addClass('is-invalid').removeClass('is-valid');
            return false;
        }
    }
    
    // For Confirmation of Password ------------
    $("#validationCustom02").on("keyup", validatePass);

    // Stuff happening after clicking on Login Button

    $("#login").on("click",(event) => {
        event.preventDefault();
        var isUsernameValid = validateUsername();
        var isPasswordValid = validatePass();
        
        if (!isUsernameValid) {
            event.preventDefault();
            event.stopPropagation();
            $("#validationCustomUsername").addClass("is-invalid");
        }

        if (!isPasswordValid) {
            event.preventDefault();
            event.stopPropagation();
            $("#validationCustom02").addClass("is-invalid");
        }

        if(isUsernameValid && isPasswordValid) {
            var formData = $("#sign-in-form").serialize();
        console.log(formData);
        $.ajax({
                url: "./php/action.php",
                method: 'POST',
                dataType: "json",
                data: formData + "&action=login",
                error: function(xhr, status, error) {
                    responder(error, "info", 2000);
                }
            }).done(function(response){
                var data = response;

                if (data.status == "success") {
                    console.error(data.username);
                    // Login successful, store session token in local storage if Remember Me is checked
                    if ($("#invalidCheck").prop('checked')) {
                        if (data.username != undefined || data.username != null) {
                            localStorage.setItem('username', data.username);
                            localStorage.setItem('sessionToken', data.sessionToken);
                            localStorage.setItem('isLoggedIn', true);
                        }
                        else {
                            console.error("Username not found in database");
                            localStorage.clear();
                        }
                    }
                    else {
                        if (data.username != undefined || data.username != null) {
                            localStorage.setItem('username', data.username);
                        }
                        else {
                            console.error("Username not found in database");
                            localStorage.clear();
                        }
                    }
                    // Redirect to dashboard or homepage
                    $.ajax({
                        url: "profile.html",
                        method: "GET",
                        success: function(response) {
                            var data = response;
                            // Replace the content of the signup section with login page content
                            responder(data.msg, data.status, 2000);
                            $("body").html(response);
                        },
                        error: function(xhr, status, error) {
                            var data = response;
                            console.error(xhr.responseText);
                            responder(error, data.msg, 2000);
                        }
                    });
                }
                else {
                    responder(data.msg, data.status, 2000);
                }
                
            });
        }

    });

    // AJAX request when Sign up button is clicked
    $("#signup_btn").click(function(e) {
        // Perform AJAX request to fetch login page content
        $.ajax({
            url: "registration.html",
            method: "GET",
            success: function(response) {
                // Replace the content of the signup section with login page content
                $("body").html(response);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
    
});