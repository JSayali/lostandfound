'use strict';
var app = angular.module('lostandfoundapp', []);

app.controller('lostandfoundController', ['$scope', '$http', '$window', function($scope, $http) {

    var socket = io();

    $scope.pageTitle = "Lost & Found Map";
    $scope.university = '/university.html';

    $scope.content = '/login.html';

    $scope.latest = '/latestmember.html';

    $scope.chat = "/chat.html";

    $scope.lostandfound = "/lostandfound.html";

    $scope.information = "/information.html";

    $scope.content = "/content.html";

    $scope.clickMe = function(ddd) {

        $scope.id = ddd.target.title;
        $("#slider").slideReveal("show");
        $("#exampleInputEmail1").val($scope.id);

    };
    $http.get('/checkSession')
        .success(function(data, status, headers, config) {
            data = data["message"];

            $scope.username = data.user_name;
            $scope.content = "/profile.html";

        })
        .error(function(data, status, headers, config) {
            $scope.content = "/login.html";
        });
    $scope.logout = function() {

        $http.get('/logout')
            .success(function(data, status, headers, config) {

                $scope.content = "/login.html";
                $scope.university = '/university.html';


            })
            .error(function(data, status, headers, config) {
                $.notify(data.message, "Error in Logoout");
            });

    }
    $scope.login = function() {

        var data = {
            username: $("#email").val(),
            password: $("#password").val()
        };

        $http.post('/login', data).success(function(data, status) {

            data = data["message"];

            $scope.username = data.user_name;

            socket.emit('onlineuser', $scope.username);

            $scope.content = "/profile.html";

        }).error(function(data, status, headers, config) {
            $.notify(data.message, "alert");
        });
    }

    $scope.register = function() {

        var data = {
            username: $("#email").val(),
            password: $("#password").val()
        };

        $http.post('/register', data).success(function(data, status) {

            $.notify(data.message, "success");

            $scope.content = "/login.html";

        }).error(function(data, status, headers, config) {

            $.notify(data.message, "alert");

        });
    }

    $scope.sendtext = function() {

        var message = $("#message").val();
        var sender = $scope.username;
        var reciever = "admin";
        var html = "";

        html += "<div class='direct-chat-msg right'><div class='direct-chat-info clearfix'>";
        html += "<span class='direct-chat-name pull-left'>" + sender + "</span>";
        html += "<span class='direct-chat-timestamp pull-right'>23 Jan 2:00 pm</span></div>";
        html += "<img class='direct-chat-img' src='libraries/dist/img/user1-128x128.jpg' alt='message user image'>";
        html += "<div class='direct-chat-text'>" + message + "</div></div>";

        $(".direct-chat-messages").append(html);

        socket.emit('textMsg', sender, reciever, message);

    };


    $scope.setContent = function(content) {

        $scope.content = content;
    }
    $scope.setUniversity = function(page) {
        if(page=="/lostitem.html"){
            $scope.pageTitle = "Lost Items";
        }
        else if(page=="/founditem.html"){
            $scope.pageTitle = "Found Items";
        }
        else{
            $scope.pageTitle = "Lost and Found Map";
        }
        $scope.university = page;
    }



    socket.on('sendMsg', function(user, msg) {

        console.log(msg);

        $.notify("new message from " + user, "success");
        var html = "";

        html += "<div class='direct-chat-msg'><div class='direct-chat-info clearfix'>";
        html += "<span class='direct-chat-name pull-left'>" + user + "</span>";
        html += "<span class='direct-chat-timestamp pull-right'>23 Jan 2:00 pm</span></div>";
        html += "<img class='direct-chat-img' src='libraries/dist/img/user1-128x128.jpg' alt='message user image'>";
        html += "<div class='direct-chat-text'>" + msg + "</div></div>";

        $(".direct-chat-messages").append(html);
    });

    $scope.myFun = function() {

        var lost = false;
        var found = false;

        if ($scope.lf === "Found")
            found = true;
        else
            lost = true;

        var data = {
            location: $scope.id,
            name: $scope.name,
            description: $scope.description,
            date: new Date(),
            lost: lost,
            found: found,
            user: $scope.username
        };

        socket.emit('addItem', data);
    };

    socket.on('updateFoundcount', function(msg) {

        $scope.founditems = msg;
        $scope.foundCount = msg.length;
        $("#fcount").html(msg.length);

    });
    socket.on('updateLostCount', function(msg) {
        $scope.lostitems = msg;
        $scope.lostCount = msg.length;
        $("#lcount").html(msg.length);
    });


    socket.on('itemAdded', function(msg) {

        $("#reset").click();

        $("#slider").slideReveal("hide");

        var lostfound = "";
        var notify1 = "";

        if (msg.lost) {
            lostfound = "Lost";
            notify1 = "error";
        } else {
            lostfound = "Found";
            notify1 = "success";
        }

        var str = msg.name + " " + lostfound + " at " + msg.location;

        var html = "";
        html += "<li style='display:none'><i class='fa fa-comments bg-yellow'></i>";
        html += "<div class='timeline-item'><span class='time'><i class='fa fa-clock-o'></i>" + msg.date;
        html += "</span><h3 class='timeline-header'><a href='#'>" + msg.user + "</a> "+lostfound+" " + msg.name;
        html += " at " + msg.location + "</h3>";
        html += "<div class='timeline-body'>" + msg.description + "</div><div class='timeline-footer'><a class='btn btn-warning btn-flat btn-xs'>";
        html += "Contact " + msg.user + "</a></div></div></li>";

        $(".timeline").prepend(html);
        $(".timeline :first-child").slideDown();

        $.notify(str, notify1);

    });

    $http.get('/getAllLostItems')
        .success(function(data, status, headers, config) {
            $scope.lostitems = data['message'];
            $scope.lostCount = data["message"].length;

        })
        .error(function(data, status, headers, config) {
            $.notify(data.message, "Error");
        });

    $http.get('/getAllFoundItems')
        .success(function(data, status, headers, config) {
            $scope.founditems = data['message'];
            $scope.foundCount = data["message"].length;
        })
        .error(function(data, status, headers, config) {
            $.notify(data.message, "Error");
        });


}]);

$(document).ready(function() {

    $('#slider').slideReveal({
        trigger: $("#trigger"),
        position: "right"
    });
});