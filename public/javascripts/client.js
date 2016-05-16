
jQuery(function($){
    var socket = io.connect();
    var $nickForm = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#nickname');
    var $users = $('#users');
    var $messageForm = $('#send-message');
    var $messageBox = $('#message');
    var $chat = $('#chat');
    var $window_chat = $(".panel-body");
    var to; //name of the user who

    $nickForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user', $nickBox.val(), function(data){
            if(data){
                $('#nickWrap').hide();
                $("#tellFriend").show();
            } else{
                $nickError.html('That username is already taken!  Try again.');
            }
        });
        $nickBox.val('');
    });
    $("#select-friend").submit(function(e){
        e.preventDefault();
        var friend = ($("#friend").val()).trim();
        socket.emit("check friend", friend, function(data){
            if(data){
                $('#nickWrap').hide();
                $("#tellFriend").hide();
                $('#contentWrap').show();
                $("#welcome").append(" "+$("#friend").val());
                $("#addClass").trigger("click", [friend]);
                var popup = "#qnimate"+friend;
                var user = "span.user";
                $(popup).find(""+user+"").append(friend);

            }
            else {
                $("#error").show();
            }
        });
    });
    socket.on("open window", function(data){
        $('#nickWrap').hide();
        $("#tellFriend").hide();
        $('#contentWrap').show();
        $("#welcome").append(" "+data.name);
        $("#addClass").trigger("click", [data.name]);
        var popup = "#qnimate"+data.name;
        var user = "span.user";
        $(popup).find(""+user+"").append(data.name);

    });
    socket.on('usernames', function(data){
        var html = '';
        for(i=0; i < data.length; i++){
            html += data[i] + '<br/>'
        }
        $users.html(html);
    });
    $("body").delegate(".send-chat", "click", function(e){

        var to = $(this).parent().parent().parent().siblings(".top-bar").find("span.user").html();
        var msg = $(this).parent().siblings().val();

        socket.emit('send message', to, msg, function(data){
            $chat.append('<span class="error">' + data + "</span><br/>");
        });
        $messageBox.val('');
    });

    socket.on('new message', function(data){
        $chat.append('<span class="msg"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
        var msgPanel = "#qnimate"+data.rec;
        $(""+msgPanel+"").find(".panel-body").append(createBase_sent(data.msg, data.nick));
    });

    socket.on('message', function(data){
        $chat.append('<span class="msg"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
        var msgPanel = "#qnimate"+data.nick;
        $(""+msgPanel+"").find(".panel-body").append(createBase_receive(data.msg, data.nick));
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
        "<a href=\"#\"><span class=\"glyphicon glyphicon-minus icon_minim minim_chat_window\"></span></a></div></div>" +
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
        if($(".popup-box").length>0){
            var right = parseInt($(".popup-box:last").css("right"));
            right = right+20+300;
            console.log("popup already present. "+ right);
            var openPopupId = "#qnimate" + friend;
            $("#popups").append(createPopup(friend));
            $("" + openPopupId + "").css("right", right);
            /*$("" + openPopupId + "").css("right", "\""+right+"px\"");*/
            console.log($("" + openPopupId + "").css("right"));
            $("" + openPopupId + "").addClass("popup-box-on");

        }
        else {
            console.log("no popup");
            var openPopupId = "#qnimate" + friend;
            $("#popups").append(createPopup(friend));
            $("" + openPopupId + "").addClass("popup-box-on");
            $("" + openPopupId + "").css("right", 70);
            console.log($("" + openPopupId + "").css("right"));
        }

    });

    $("#removeClass").click(function () {
        $('.popup-box').removeClass('popup-box-on');
    });
})