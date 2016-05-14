var mongoose = require('mongoose');

Schema = mongoose.Schema;

// Document schema for polls
var userSchema = new mongoose.Schema({
	firstname:String,
	lastname:String,
	user_name: String,
	password:String
});

mongoose.model('Users',userSchema);


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