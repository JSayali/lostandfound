var mongoose = require('mongoose');

Schema = mongoose.Schema;


// Subdocument schema for votes
//var voteSchema = new mongoose.Schema({ ip: 'String' });

// Subdocument schema for poll choices
var postSchema = new mongoose.Schema({ 
	content: String,
	user:String,
	date:Date,
	approved:Boolean,
	like:[String],
	dislike:[String]
});

mongoose.model('Posts',postSchema);
// Document schema for polls
var userSchema = new mongoose.Schema({
	firstname:String,
	lastname:String,
	user_name: String,
	password:String
});

mongoose.model('Users',userSchema);


var groupSchema = new mongoose.Schema({
	groupname:String,
	description:String,
	users: [String],
	createdBy:String,
	createOn:Date
});

mongoose.model('Groups',groupSchema);

var lostandfoundSchema=new mongoose.Schema({
	location:String,
	name:String,
	description:String,
	date:Date,
	lost:Boolean,
	found:Boolean,
	user:String
});

mongoose.model('LostandFound',lostandfoundSchema);