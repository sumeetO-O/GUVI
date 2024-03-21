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
    // ------------------------------------------------
    // For password validation UI elements
    $(".pr-password").passwordRequirements();

    $(".pr-password").passwordRequirements({
        numCharacters: 8,
        useLowercase: true,
        useUppercase: true,
        useNumbers: true,
        useSpecial: true
    });

    $(".pr-password").passwordRequirements({
        fadeTime: 500
    });
    // -----------------------------
    
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

    // Email check & validation ----------------------------------------------------------------
    function validateEmail() {
        $value = $(".email").val();
        if($value == '') return null
        var emailReg = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
        return emailReg.test($value);
    }
    $(".email").on("keyup", () => {
        if(validateEmail()){
            $(".email").removeClass("is-invalid").addClass("is-valid");
        }
        else {
            $(".email").addClass("is-invalid");
        }
    });
    // ------------------------------------------------------------------------------------------------------------------

    // Validate Password -----------------------

    function validatePassConfirm() {
        pass = $("#validationCustom02").val();
        c_pass = $("#validationCustom03").val();
        if (c_pass == ""){
            $("#validationCustom03").removeClass("is-valid").removeClass("is-invalid");
            return;
        }

        if (pass === c_pass) {
            $("#validationCustom03").addClass('is-valid').removeClass('is-invalid');
        }
        else {
            $("#validationCustom03").addClass('is-invalid').removeClass('is-valid');
        }
    }
    
    // For Confirmation of Password ------------
    $(".pr-password").on("keyup", validatePassConfirm);
    $("#validationCustom03").on("keyup",validatePassConfirm);
    // -----------------------------------------

    function validatePassword() {
        var isValid = $(".pr-password").hasClass("is-valid");
        if (isValid) {
            return true;
        }
        else {
            return false;
        }
    }
    function validateConfirmPass() {
        var confirmed = $("#validationCustom03").hasClass("is-valid");
        if (confirmed) {
            return true;
        }
        else {
            return false;
        }
    }

    // -----------------------------------------

    function validateCheckbox() {
        var isChecked = $("#invalidCheck").is(':checked');
        if (isChecked) {
            $("#invalidCheck").removeClass("is-invalid").addClass("is-valid");
            return true;
        }
        else {
            $("#invalidCheck").addClass("is-invalid");
            return false;
        }
    }
    $("#invalidCheck").change(function() {
        var isChecked = $(this).is(':checked');
        if (isChecked) {
            $(this).addClass("is-valid").removeClass("is-invalid");
        }
        else {
            $(this).addClass("is-invalid");
        }
    });

    // Stuff happening when i click on SUBMIT button

    $(".signup").on("click",(event) => {
        event.preventDefault();
        var isUsernameValid = validateUsername();
        var isEmailValid = validateEmail();
        var isPasswordValid = validatePassword();
        var isCheckboxValid = validateCheckbox();
        var isConfirmPassValid = validateConfirmPass();
        
        if (!isUsernameValid) {
            event.preventDefault();
            event.stopPropagation();
            $(".username").addClass("is-invalid");
        }

        if (!isEmailValid) {
            event.preventDefault();
            event.stopPropagation();
            $(".email").addClass("is-invalid");
        }

        if (!isPasswordValid) {
            event.preventDefault();
            event.stopPropagation();
            $(".pr-password").addClass("is-invalid");
        }

        if (!isConfirmPassValid) {
            event.preventDefault();
            event.stopPropagation();
            $("#validationCustom03").addClass("is-invalid");
        }

        if(!isCheckboxValid) {
            event.preventDefault();
            event.stopPropagation();
            $("#invalidCheck").addClass("is-invalid");
        }

        if(isUsernameValid && isEmailValid && isPasswordValid && isCheckboxValid && isConfirmPassValid) {
            var formData = $("#sign-up-form").serialize();
            console.log(formData);
            $.ajax({
                    url: "./php/action.php",
                    method: 'POST',
                    dataType: "json",
                    data: formData + "&action=register",
                    error: function(xhr, status, error) {
                        responder(error, "info", 2000);
                    }
                }).done(function(response){
                    var data = response;
                    console.log(data);
                    responder(data.msg, data.status, 2000);
                    if (data.status == "success") {
                        setTimeout(function(){
                            $("#registration_form").hide();
                            $("#user_data").show();
                        },1000);
                    }
                });
        }

    });
    
    // ----------------------------------------------------------------

    // AJAX request when Sign in button is clicked
    $("#login_btn").click(function(e) {
        // Perform AJAX request to fetch login page content
        $.ajax({
            url: "login.html",
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

    $('#profileForm').submit(function(e) {
        e.preventDefault();
        // Perform form submission here
        var formData = $("#profileForm").serialize();
        console.log(formData);
        $val = $('#validationCustomUsername').val();
        console.log($val);
        $.ajax({
            url: "./php/register.php",
            method: 'POST',
            dataType: "json",
            data: formData + "&username=" + $val,
            error: function(xhr, status, error) {
                responder(error, "info", 2000);
            }
        }).done(function(response){
            var data = response;
            console.log(data);
            responder(data.msg, data.status, 2000);
            if(data.out == "success"){
                // Redirect to login page
                setTimeout(() => {
                    $.ajax({
                        url: "login.html",
                        method: "GET",
                        success: function(response) {
                            // Replace the content of the signup section with login page content
                            $("body").html(response);
                        },
                        error: function(xhr, status, error) {
                            console.error(xhr.responseText);
                        }
                    })
                }, 1000);
            }
        });
    });
    
});