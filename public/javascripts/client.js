// JOES TODO: figure out where to supply the error messages to HTML template,
//               and figure out how to handle success of new user registry
//              (IE: redirect to login?).

"use strict";

var main = function(){
    var invalidUserName = function(userName){
        /**
        * Returns true if string represents an INVALID user name. False otherwise.
        *
        * @param {String} userName - Represents a user name supplied by user
        * @returns {Boolean} invalid - Initialized to true.  Toggles to false if
        *    userName.match(regex) passes.
        */
        var invalid = true;
        var regex = /^(\w+)$/;
        if(userName.match(regex){
            invalid = false;
        }
        return invalid;
    }

    var resetInputs = function(){
        /**
        * Sets inputs with classes userNameInput, password1Input,
        *   and password2Input to empty string.
        */
        $(".userNameInput").val("");
        $(".password1Input").val("");
        $(".password2Input").val("");
    };

    $(".registerUser").on("click", function () {
        /**
        * Sends user name and password to server for validation.  If invalid
        *   input is given an error message is displayed.  Server can return JSON
        *   with "success" field if user info is added to the database or with
        *   "error" field if database connection fails or the username already
        *   exists for another user in the system.
        *
        */
        $(".errorMessage").text("");
        // If empty userNameInput
        if($(".userNameInput").val() === ""){
            $(".errorMessage").text("Fill in User Field");
            resetInputs();
        }
        else if($(".fullNameInput").val() === ""){
            $(".errorMessage").text("Fill in Full Name Field");
            resetInputs();
        }
        // If user name supplied does not fit criteria
        else if(invalidUserName($(".userNameInput").val())){
            $(".errorMessage").text("User Names Contain Letters, Numbers, and Underscore Only.");
            resetInputs();
        }
        // If any password fields are left blank.
        else if($(".password1Input").val() === "" || $(".password2Input").val() === ""){
            $(".errorMessage").text("Fill in Both Password Fields");
            resetInputs();
        }
        // If passwords do not match
        else if($(".password1Input") !== $(".password2Input")){
            $(".errorMessage").text("Passwords Must Match");
            resetInputs();
        }
        else{
            console.log("registerUser Clicked");
            $.ajax({
                method: "POST",
                url: "http://localhost:3000/register/",
                data: {
                    "fullName":$(".fullNameInput").val(),
                    "userName":$(".userNameInput").val(),
                    "password1":$(".password1Input").val(),
                    "password2":$(".password2Input").val()
                },
                success: function(data){
                    console.log("Post Data: " + data);
                        //redirect to login or other.
                },
                error: function(data){
                        // Displays type of error in specified DOM element
                        $(".errorMessage").text(data.error);
                }
            });
        }
    });

};

$(document).ready(main);
