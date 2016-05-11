var mongoose=require('mongoose');
var Twitter = require("twitter");

Posts=mongoose.model('Posts');


exports.tweet=function(req,res){

var post=new Posts(
	{
	content:req.body.tweet,
	user:req.body.user,
	date:req.body.date,
	approved:req.body.approved,
	like:req.body.like,
	dislike:req.body.dislike,
	});

 post.save(function(err, results){
	    if(err){
	      console.log(err);
	    } else {
	      res.json({message:"Congratulations.You have successfully added post for discussion."});
	    }
	});

};
exports.loadTweets=function(req,res){

Posts.find(function(err, tweets) {
  if (err) return console.error(err);
  res.json({message:tweets});
});

};
exports.likePost=function(req,res){

Posts.findOne({_id: req.body.postid })
  .exec(function(err, post) {
    if (!post)
    {
		console.log("No such post");
    } 
    else
    {   		
    		likearr=post.like;
    		dislikearr=post.dislike;
    		var ind=dislikearr.indexOf(req.body.user);
    		if (ind > -1) {
   				 dislikearr.splice(ind, 1);
			}
			likearr.push(req.body.user);
			post.like=likearr;
			post.dislike=dislikearr;
			post.save();
			res.json({message:"success"});

    }
  });



};
exports.disLikePost=function(req,res){

Posts.findOne({_id: req.body.postid })
  .exec(function(err, post) {
    if (!post)
    {
		console.log("No such post");
    } 
    else
    {
    		
    		likearr=post.like;
    		dislikearr=post.dislike;
    		var ind=likearr.indexOf(req.body.user);
    		if (ind > -1) {
   				 likearr.splice(ind, 1);
			}
			dislikearr.push(req.body.user);
			post.like=likearr;
			post.dislike=dislikearr;
			post.save();
			res.json({message:"success"});
    }
  });
};
exports.postTwitter=function(req,res){

var tweet=req.body.tweet;

var client = new Twitter({
        consumer_key: "wdupZpyaeLjCvqhsrJsDp20ix",
        consumer_secret: "xsAzRqdU32W59Ow2OjhAtyex7WozQwWClc1Vf7bOYoIYTKHHYs",
        access_token_key: "706613428790566912-BYASC0htSA2V2bcB2Ps4OmQdpwj3s40",
        access_token_secret: "L8SL9Na2RwZ6c12r4HlxVJkXQnC5CqHn60GQjoWxYINmT"
    });

    client.post("statuses/update", {
        status: tweet
    }, function(error, tweet, response) {
        if (error) {
        	console.log(error);
            throw error;
        }
        console.log(tweet); // Tweet body.
        console.log(response); // Raw response object.
        res.json({message:"Successfully Tweeted"});
            
    });




};