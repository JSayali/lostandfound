var express = require("express"),cmd
    http = require("http");
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/lostandfound')
var bodyParser = require("body-parser");
var passport = require('passport')
var cookieParser = require("cookie-parser");
var request = require("request");

require('./models/tweet_model.js');
var LostandFound=mongoose.model('LostandFound');

var session = require('express-session');

app = express();
server = http.createServer(app);
var io = require('socket.io').listen(server);

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: "RQSHJD23HG"
}));

require('./routes/index')(app, passport);

io.on('connection', function(socket) {


	socket.on('addItem',function(msg){

		lf=new LostandFound(msg);

		lf.save();


		io.emit('itemAdded', lf);

		if(lf.found)
		{
		LostandFound.find({found:true},function(err, founditems) {
	  	if (err) return console.error(err);
	  	io.emit('updateFoundcount',founditems);
	  	});
		}
		else
		{
		LostandFound.find({lost:true},function(err, lostitems) {
	  	if (err) return console.error(err);
	  	io.emit('updateLostCount',lostitems);
	  	});
		}

});

		


	});



server.listen(8000);
console.log("Server started on port:8000");