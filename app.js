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

// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
// The index redirects here
app.get('/submit/:mail', function(req,res) {

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    
    //How to get data...
	var prev_status = waterQuality (temp, turb, cond, pH)
	var current_status = waterQuality (temp, turb, cond, pH)
	
	function change_messg (prev, curr){
		if (prev<50 && (curr >= 50 && curr < 100))
			return "The water quality of the well has changed from SAFE to WARNING."
		else if (curr<50 && (prev >= 50 && prev < 100))
			return "The water quality of the well has changed from WARNING to SAFE."
		else if ((prev >= 50 && prev < 100) && (curr >=100))
			return "The water quality of the well has changed from WARNING to DANGEROUS."
		else if ((curr >= 50 && curr < 100) && (prev >=100))
			return "The water quality of the well has changed from DANGEROUS to WARNING."
		else if (prev<50 && (curr >= 100))
			return "The water quality of the well has changed from SAFE to DANGEROUS."
		else if (curr<50 && (prev >= 100))
			return "The water quality of the well has changed from DANGEROUS to SAFE."
	}
	
	function check_change (prev, curr){
		if (prev<50 && (curr >= 50 && curr < 100))
			return true
		else if (curr<50 && (prev >= 50 && prev < 100))
			return true
		else if ((prev >= 50 && prev < 100) && (curr >=100))
			return true
		else if ((curr >= 50 && curr < 100) && (prev >=100))
			return true
		else if (prev<50 && (curr >= 100))
			return true
		else if (curr<50 && (prev >= 100))
			return true
		else
			return false
	}
	
    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: req.params.mail,
    //Subject and text data  
      subject: 'Alert: Well Water Quality',
      html:  change_messg (prev_status, current_status) + '<a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
    }
	
	//Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else if (check_change (prev_status, current_status){
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