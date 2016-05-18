var express = require("express");
//var router = express.Router();
var auth=require('../controllers/auth_controller.js');
var users=require('../controllers/user_controller.js');

module.exports=function(app,passport){

    var lostandfound=require('../controllers/lostandfound.js');


    app.get("/", function(req, res) {
        app.use(express.static('public'));
        res.render("index", { title: "LostAndFound" });
    });


    app.post("/register",users.register);
    app.post("/login", auth.login);
    app.get("/logout",auth.logout);
    app.get("/checkSession",auth.checkSession);
    app.get("/getAllUsers",users.getAllUsers);
    app.post("/editProfile",users.editProfile);
    app.get("/getAllLostItems",lostandfound.getAllLostItems);
    app.get("/getAllFoundItems",lostandfound.getAllFoundItems);
    app.post("/postDelete", lostandfound.postDelete);
}

