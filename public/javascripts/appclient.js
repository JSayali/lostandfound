'use strict';
var app = angular.module('lostandfoundapp',[]);

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

        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var year = today.getFullYear();
        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();
        var maxDate = year + '-' + month + '-' + day;

        $('#date').attr('max', maxDate);


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
        $("#slider").slideReveal("hide");
        socket.emit("logout");
        $("#popups").html("");
        $http.get('/logout')
            .success(function(data, status, headers, config) {
                $scope.content = "/login.html";
                $scope.university = '/university.html';

            })
            .error(function(data, status, headers, config) {
                $.notify(data.message, "Error in Logoout");
            });

    };
    $scope.update = function(id){

        var data ={
            id: id,
            user: $scope.username
        };
        $http.post("/updateLikes", data)
            .success(function(data){
                console.log(data);
            });
    };
    $scope.login = function() {

        var data = {
            username: $("#email").val(),
            password: $("#password").val()
        };

        $http.post('/login', data).success(function(data, status) {

            data = data["message"];

            $scope.username = data.user_name;
            $scope.likes = data.likes;

            socket.emit('onlineuser', $scope.username, function (data) {
            });
            $scope.content = "/profile.html";
            updateFoundStars();
            updateLostStars();

        }).error(function(data, status, headers, config) {
            $.notify(data.message, "alert");
        });
    };
    function updateLostStars(){
        ($scope.lostitems).forEach(function(d){
            if(($scope.likes).indexOf(d._id)!==-1){
                d.star = true;
            }
            else{
                d.star = false;
            }
        });
        $scope.lostitems = $scope.lostitems;
    }
    function updateFoundStars(){
        ($scope.founditems).forEach(function(d){
            if(($scope.likes).indexOf(d._id)!==-1){
                d.star = true;
            }
            else{
                d.star = false;
            }
        });
        $scope.founditems = $scope.founditems;
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
    $("body").delegate(".send-chat", "click", function(e){

        var to = $(this).parent().parent().parent().siblings(".top-bar").find("span.user").html();
        var msg = $(this).parent().siblings().val();

        socket.emit('send message', to, msg, function(data){
            var msgPanel = "#qnimate"+to;
            $(""+msgPanel+"").find(".panel-body").append("Sorry! User is not online. Please try again later.");
        });
    });

    $scope.postDelete = function(itemId){
        console.log("item is: "+itemId);

        $http.post("/postDelete",{item: itemId})
            .success(function(data){
                if(data.success){
                    socket.emit("postDelete", itemId, function(data){
                    })
                }
                console.log(data);
            });
    };
    socket.on("delete post", function(data){
        var li = "#"+data;
        /*$(""+li+"").remove();*/
        $(""+li+"").fadeOut(1600, function() {
            $(""+li+"").remove();
        });
    });
    socket.on('new message', function(data){
        var msgPanel = "#qnimate"+data.rec;
        $(""+msgPanel+"").find(".panel-body").append(createBase_sent(data.msg, data.nick));
    });

    socket.on('message', function(data){
        var msgPanel = "#qnimate"+data.nick;
        $(""+msgPanel+"").find(".panel-body").append(createBase_receive(data.msg, data.nick));
    });
    socket.on("open window", function(data){
        $("#addClass").trigger("click", [data.name]);
        var popup = "#qnimate"+data.name;

    });

    /*$scope.myFun = function() {

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
            date: $scope.date,
            lost: lost,
            found: found,
            user: $scope.username,
            date_posted: new Date(),
            date_formated: getDate()
        };
        $scope.detailsForm.$setPristine();
        socket.emit('addItem', data);
    };*/

    $("#formSubmit").on("click", function(){
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
            date: $scope.date,
            lost: lost,
            found: found,
            user: $scope.username,
            date_posted: new Date(),
            date_formated: getDate()
        };
        $scope.detailsForm.$setPristine();
        socket.emit('addItem', data);
    });
    socket.on('updateFoundcount', function(msg) {
        $scope.founditems = msg;
        $scope.foundCount = msg.length;
        /*$("#fcount").html(msg.length);*/
        $("#fcount").hide();
        $("#fcount").html(msg.length);
        $("#fcount").slideDown("slow", function(){
            console.log("done");
        });

    });
    socket.on('updateLostCount', function(msg) {
        $scope.lostitems = msg;
        $scope.lostCount = msg.length;
        /*$("#lcount").html(msg.length);*/
        $("#lcount").hide();
        $("#lcount").html(msg.length);
        $("#lcount").slideDown("slow", function(){
            console.log("done");
        });
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $("#cancelForm").on("click", function () {
        $("#reset").click();
        $("#slider").slideReveal("hide");
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
        html += "</span><h3 class='timeline-header'><a ng-model='user' href='#'>" + msg.user + "</a> "+lostfound+" " + msg.name;
        html += " at " + msg.location + "</h3>";
        html += "<div class='timeline-body'>" + msg.description + "</div><div class='timeline-footer'><button ng-hide='username==user' " +
            "class='btn btn-warning btn-flat btn-xs contact'>";
        html += "Contact <span>" + msg.user + "</span></button>";
        html += "<a class='postStar' href='#' ng-model='item.star' ng-click='update(item._id); item.star=!item.star;'>";
        html += "<i ng-class='{'fa fa-heart':item.star,'fa fa-heart-o':!item.star}'></i></a></div></div></li>";
        console.log(html);
        /*var temp = $compile(html)($scope);
         angular.element(document.getElementById('.timeline')).prepend(temp);*/
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

    /*Get month name from month number*/
    function GetMonthName(monthNumber) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[monthNumber - 1];
    }

    /*Get today's date*/
    function getDate() {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = GetMonthName(month) + " " + day + ", " + d.getFullYear();
        return output;
    }
    /*$scope.contact = function(user){
     var to = user;
     var from = $scope.username;

     socket.emit("check friend", to, function(data){

     if(data){
     $("#addClass").trigger("click", [to]);
     }
     else {
     $.notify(to+" is not online. Please try again later.", "alert");
     }
     });
     };*/
    $("body").delegate(".contact", "click",function(){
        var to = ($(this).find("span").html()).trim();
        var from = $scope.username;

        socket.emit("check friend", to, function(data){

            if(data){
                $("#addClass").trigger("click", [to]);
            }
            else {
                $.notify(to+" is not online. Please try again later.", "alert");
            }
        });
    });


}]);

$(document).ready(function() {

    $('#slider').slideReveal({
        trigger: $("#trigger"),
        position: "right"
    });


});

function createBase_sent(data, user){
    var base_sent = "<div class=\"row msg_container base_sent\"> <div class=\"col-md-10 col-xs-10\"> <div class=\"messages msg_sent\"> " +
        "<p>"+data+"</p><time datetime=\"2009-11-13T20:00\">"+user+"</time></div></div><div class=\"col-md-2 col-xs-2 avatar\">" +
        "<img src=\"http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg\" class=\" img-responsive \">" +
        "</div></div>";
    return base_sent;
}

function createBase_receive(data, user){
    var base_receive = "<div class=\"row msg_container base_receive\"><div class=\"col-md-2 col-xs-2 avatar\">" +
        "<img src=\"http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg\" class=\" img-responsive \"> " +
        "</div><div class=\"col-md-10 col-xs-10\"><div class=\"messages msg_receive\"><p>"+data+"</p>" +
        "<time datetime=\"2009-11-13T20:00\">"+user+"</time></div></div></div>";
    return base_receive;
}

function createPopup(friend){
    var popup_id = "qnimate"+friend;
    var popup = "<div class=\"popup-box chat-popup\" id=\""+popup_id+"\">" +
        "<div class=\"row chat-window col-xs-5 col-md-3\">" +
        "<div class=\"panel panel-default\"><div class=\"panel-heading top-bar\"><div class=\"col-md-8 col-xs-8\">" +
        "<h3 class=\"panel-title\"><span class=\"glyphicon glyphicon-comment\"></span><span class=\"user\"></span></h3></div>" +
        "<div class=\"col-md-4 col-xs-4\" style=\"text-align: right;\">" +
        "<a href=\"#\"><span class=\"glyphicon glyphicon-minus icon_minim minim_chat_window\"></span></a>" +
        "<a href=\"#\"><span class=\"glyphicon glyphicon-remove icon_close\"></span></a></div></div>" +
        "<div class=\"panel-body msg_container_base\"></div><div class=\"panel-footer\"><div class=\"input-group\">" +
        "<input type=\"text\" class=\"form-control input-sm chat_input\" placeholder=\"Write your message here...\" />" +
        "<span class=\"input-group-btn\"><button class=\"btn btn-primary btn-sm send-chat\">Send</button>" +
        "</span></div></div></div></div></div>";
    return popup;
}
//for pop-up
$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('.minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('.minim_chat_window').removeClass('panel-collapsed');
        $('.minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(function(){
    $("#addClass").click(function (event, friend) {
        var openPopupId = "#qnimate" + friend;
        if( $("" + openPopupId + "").length>0){

            $("" + openPopupId + "").addClass("popup-box-on");
        }
        else if($(".popup-box").length>0){
            var right = parseInt($(".popup-box:last").css("right"));
            right = right+20+300;
            $("#popups").append(createPopup(friend));
            $("" + openPopupId + "").css("right", right);
            $("" + openPopupId + "").addClass("popup-box-on");
            $("" + openPopupId + "").find("span.user").append(friend);

        }
        else {

            $("#popups").append(createPopup(friend));
            $("" + openPopupId + "").addClass("popup-box-on");
            $("" + openPopupId + "").css("right", 70);

            $("" + openPopupId + "").find("span.user").append(friend);
        }

    });

    $("body").delegate(".icon_close", "click", function(){
        $(this).parent().parent().parent().parent().parent().parent().removeClass("popup-box-on");
    })

})
