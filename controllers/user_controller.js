var mongoose=require('mongoose');

Users=mongoose.model('Users');
Groups=mongoose.model('Groups');

exports.register=function(req,res){

 Users.findOne({user_name: req.body.username })
  .exec(function(err, user) {
    if (!user)
    {
	var user=new Users({firstname:req.body.fname,lastname:req.body.lname,user_name:req.body.username,password:req.body.password});
	 user.save(function(err, results){
	    if(err){
	      console.log(err);
	    } else {
	      res.json({message:"Congratulations.You have successfully registerd.Please Login."});
	    }
	});

    } 
    else {
      res.json(403, {
                message: "Username Already Exist"
            });
    }
  });
}

 exports.editProfile=function(req,res){

 Users.findOne({user_name: req.body.username })
  .exec(function(err, user) {
    if (!user)
    {
    	console.log("No user Found")
    } 
    else {
    	user.firstname=req.body.fname;
    	user.lastname=req.body.lname;
    	user.save();
    	usersession = req.session;
    	usersession.user=user;
    	res.json({message:"User Profile Updated Successfully"});
    }
  });
}


exports.getAllUsers=function(req,res){

Users.find(function(err, users) {
  if (err) return console.error(err);
  res.json({message:users});
});
}


exports.newGroup=function(req,res){

var group=new Groups({groupname:req.body.gname,
	description:req.body.gdesc,
	users: req.body.users,
	createdBy:req.body.admin,
	createOn:req.body.date})

group.save();

res.json({message:"Success"});


}


exports.loadGroups=function(req,res){

var username=req.body.username;
console.log(username);
  Groups.find({ 'users': username },function(err, groups) {
         if (err) return console.error(err); 
         var useringroups=[];
         groups.forEach(function(entry)
         {
         	console.log(entry._id);
          useringroups.push(entry._id);
         });
         res.json({message:groups});
       }); 

}