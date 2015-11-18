// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var Schema         = mongoose.Schema;
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================
	
// config files
var port = process.env.PORT || 8080; // set our port
var db = require('./config/db');


//connect to our ewh database in mongodb, defined by the url defined in db.js
connection = mongoose.createConnection(db.readingsURL);


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Cornell Engineering World Health presents Dashboard on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app