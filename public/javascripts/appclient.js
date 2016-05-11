'use strict';
var app = angular.module('lostandfoundapp', []);

app.controller('lostandfoundController', ['$scope', '$http', '$window', function($scope, $http) {

    var socket = io();

    $scope.university='/university.html';

    $scope.content = '/login.html';

    $scope.latest = '/latestmember.html';

    $scope.chat="/chat.html";

    $scope.lostandfound="/lostandfound.html";

    $scope.information="/information.html";

    $scope.content="/content.html";

    $scope.check="Hello";

    $scope.username="Ketul Shah";

    $scope.clickMe=function(ddd){

        $scope.id=ddd.target.id;

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

                if(data.success){
                    $scope.content = "/login.html";
                }

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
    $scope.setContent = function(content) {

        $scope.content = content;
    }
    $scope.setUniversity=function(page){
        $scope.university=page;
    }

    $scope.myFun=function(){

        var lost=false;
        var found=false;

        if($scope.lf==="Found")
            found=true;
        else
            lost=true;

        var data={
            location:$scope.id,
            name:$scope.name,
            description:$scope.description,
            date:new Date(),
            lost:lost,
            found:found,
            user:$scope.username
        };

        socket.emit('addItem', data);
    };

    socket.on('updateFoundcount',function(msg){

        console.log("call1");
        $scope.founditems=msg;
        console.log($scope);
        $scope.foundCount=msg.length;
        $("#fcount").html(msg);


    });
    socket.on('updateLostCount',function(msg){

        console.log("call2");
        $scope.lostitems=msg;
        console.log($scope);
        $scope.lostCount = msg.length;
        $("#lcount").html(msg);

    });


    socket.on('itemAdded',function(msg){

        $("#slider").slideReveal("hide");

        var lostfound="";
        var notify1="";

        if(msg.lost)
        {
            lostfound="Lost";
            notify1="error";
        }
        else
        {
            lostfound="Found";
            notify1="success";
        }

        var str=msg.name+" "+lostfound+" at "+msg.location;

        var html="";
        html+="<li><i class='fa fa-comments bg-yellow'></i>";
        html+="<div class='timeline-item'><span class='time'><i class='fa fa-clock-o'></i>"+msg.date;
        html+="</span><h3 class='timeline-header'><a href='#'>"+msg.user+"</a> added "+msg.name;
        html+="Found at "+msg.location+"</h3>";
        html+="<div class='timeline-body'>"+ msg.description+"</div><div class='timeline-footer'><a class='btn btn-warning btn-flat btn-xs'>";
        html+="Contact "+msg.user+"</a></div></div></li>";

        $(".timeline").prepend(html);

        $.notify(str, notify1);

    });





    $http.get('/getAllLostItems')
        .success(function(data, status, headers, config) {
            $scope.lostitems = data['message'];
            $scope.lostCount=data["message"].length;

        })
        .error(function(data, status, headers, config) {
            $.notify(data.message, "Error");
        });

    $http.get('/getAllFoundItems')
        .success(function(data, status, headers, config) {
            $scope.founditems = data['message'];
            $scope.foundCount=data["message"].length;
        })
        .error(function(data, status, headers, config) {
            $.notify(data.message, "Error");
        });


}]);

$(document).ready(function(){


    /* $('#university').on('prepend','.timeline',function(data){
     console.log(data);
     });*/

    $('#slider').slideReveal({
        trigger: $("#trigger"),
        position:"right"
    });
});