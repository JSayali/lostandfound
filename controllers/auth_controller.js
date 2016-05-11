var mongoose=require('mongoose');
var passport=require('passport')
, LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");
Users=mongoose.model('Users');
Groups=mongoose.model('Groups');


exports.login=function(req,res) {

  var message;
  var status;
  var usersession=req.session;
    
    Users.findOne({ user_name: req.body.username }, function (err, user) {
      if (err) { console.log(err); }
      // Return if user not found in database
      if (!user) {
          message="No users found";
          status=403;
      }
      else if (user.password!==req.body.password) {
            message="Please Enter Correct Password";
            status=403;
      }
      else
      {
      usersession.user = user;
      usersession.save(); 
      status=200;
      message=usersession.user;
     }
     //console.log(status)
      // If credentials are correct, return the user object
     res.json(status,{message:message});
    });
}

exports.checkSession=function(req,res)
{
 usersession = req.session;

 if (typeof usersession.user !== "undefined") {
        var data = usersession.user;
        res.json({message:data});
    } else 
    {
        res.json(403,{message:"Please Login"});
    }

}

exports.logout=function(req,res)
{
req.session.destroy();
res.send("success");
}

