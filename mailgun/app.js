var express = require('express');
var Mailgun = require('mailgun-js');
var app = express();
app.listen(3000)
    /* server */
    //var app = express.createServer();
var mongoose = require('mongoose');
var api_key = 'key-02d0a247af399c0ba4969286f256539f';
var domain = 'sandbox8699ab236c864e45b25684c8831c25d9.mailgun.org';
var from_who = 'ec587@cornell.edu';

//Tell express to fetch files from the /js directory
app.use(express.static(__dirname + '/js'));
app.set('view engine', 'jade')

//Do something when you're landing on the first page
app.get('/', function(req, res) {
    //render the index.jade file - input forms for humans
    res.render('index', function(err, html) {
        if (err) {
            // log any error to the console for debug
            console.log(err); 
        }
        else { 
            //no error, so send the html to the browser
            res.send(html)
        };
    });
});

var badtemp = 90;
			var okaytemp = 70;
			var goodtemp = 50;
			var badturb = 7;
			var okayturb = 5;
			var goodturb = 1;
			var badcond = 10;
			var okaycond = 7.5;
			var goodcond = 5.8;
			var badpH = 9.5;
			var okaypH = 8.0;
			var goodpH = 7.0;
			function scaleTemp (temp){
				if (temp > badtemp) {
					return 100;
				}
				else if (temp <= badtemp && temp >= okaytemp){
					return ((100 - 50) * (temp - okaytemp) / (badtemp - okaytemp)) + 50;
				}
				else if (temp < okaytemp && temp >= goodtemp){
					return ((50 - 0) * (temp - goodtemp) / (okaytemp - goodtemp));
				}
				else {
					return 0;
				}
			}
			function scaleTurb (turb){
				if (turb > badturb) {
					return 100;
				}
				else if (turb <= badturb && turb >= okayturb){
					return ((100 - 50) * (turb - okayturb) / (badturb - okayturb)) + 50;
				}
				else if (turb < okayturb && turb >= goodturb) {
					return ((50 - 0) * (turb - goodturb) / (okayturb - goodturb));
				}
				else {
					return 0;
				}
			}
			function scaleCond (cond){
				if (cond > badcond) {
					return 100;
				}
				else if (cond <= badcond && cond >= okaycond){
					return ((100 - 50) * (cond - okaycond) / (badcond - okaycond)) + 50;
				}
				else if (cond < okaycond && cond >= goodcond) {
					return ((50 - 0) * (cond - goodcond) / (okaycond - goodcond));
				}
				else 
				{
					return 0;
				}
			}
			function scalepH (pH){
				if (pH > badpH) {
					return 100;
				}
				else if (pH <= badpH && pH >= okaypH){
					return ((100 - 50) * (pH - okaypH) / (badpH - okaypH)) + 50;
				}
				else if (pH < okaypH && pH >= goodpH) {
					return ((50 - 0) * (pH - goodpH) / (okaypH - goodpH));
				}
				else {
					return 0;
				}
			}
			function waterQuality (temp, turb, cond, pH){
				return ((scaleTemp (temp) + scaleTurb (turb) + scaleCond (cond) + scalepH (pH))/4);
			}
			
// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
// The index redirects here
app.get('/submit/:mail', function(req,res) {

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: req.params.mail,
    //Subject and text data  
      subject: 'Alert: Well Water Quality',
      html: 'The water quality of the well changed. <a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
    }
    
    //How to get data...
	var prev_status = waterQuality (temp, turb, cond, pH)
	var current_status = waterQuality (temp, turb, cond, pH)
	
	//Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else if ((prev_status < 50 && current_status >=50) || (prev_status < 100 && current_status >= 100) ||
        			(prev_status >= 100 && current_status < 100) || (prev_status >= 50 && current_status < 50)){
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });

});

//Adds an email to the mailing list
app.get('/validate/:mail', function(req,res) {
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var members = [
      {
        address: req.params.mail
      }
    ];
    mailgun.lists('mymailinglist@sandbox8699ab236c864e45b25684c8831c25d9.mailgun.org').members().add({ members: members, subscribed: true }, function (err, body) {
      console.log(body);
      if (err) {
            res.send("Error - check console");
      }
      else {
        res.send("Added to mailing list");
      }
    });

})

app.get('/invoice/:mail', function(req,res){
    //Which file to send? I made an empty invoice.txt file in the root directory
    //We required the path module here..to find the full path to attach the file
    var path = require("path");
    var fp = path.join(__dirname, 'invoice.txt');
    //Settings
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
      from: from_who,
      to: req.params.mail,
      subject: 'An invoice from your friendly hackers',
      text: 'A fake invoice should be attached, it is just an empty text file after all',
      attachment: fp
    };


    //Sending the email with attachment
    mailgun.messages().send(data, function (error, body) {
        if (error) {
            res.render('error', {error: error});
        }
            else {
            res.send("Attachment is on its way");
            console.log("attachment sent", fp);
            }
        });
})

    /* models */
    mongoose.connect('mongodb://127.0.0.1/sampledb');

    var Schema = mongoose.Schema
      , ObjectId = Schema.ObjectID;

    var Hobby = new Schema({
        name            : { type: String, required: true, trim: true }
    });

    var Person = new Schema({
        first_name      : { type: String, required: true, trim: true }
      , last_name       : { type: String, required: true, trim: true }
      , email        : { type: String, required: true, trim: true }
    });

    var Person = mongoose.model('Person', Person);

    app.get('/', function(req,res){
        Person.find({}, function(error, data){
            res.json(data);
        });
    });

    app.get('/adduser/:first/:last/:email', function(req, res){
        var person_data = {
            first_name: req.params.first
          , last_name: req.params.last
          , email: req.params.email
        };

        var person = new Person(person_data);

        person.save( function(error, data){
            if(error){
                res.json(error);
            }
            else{
                res.json(data);
            }
        });
    });        
			

};


    });

    app.listen(3001);

//app.listen(3030);