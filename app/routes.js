//importing our Reading model, which has a predefined schema you can see in Readings.js
var mongoose       = require('mongoose');
var Reading        = require('./models/Readings.js');
var data           = require('./data.json');
var bodyParser     = require('body-parser')

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route

var new_load = new Array();

//this should be how we add to the database from now on, except I'm not sure
//what we put in the first param for app.postr
/*
app.use(bodyParser.json());
app.use(bodyParser.urlEncoded({extended: true}));
*/
app.post('/', function(req, res) {
  var new_load = req.body.data;
  console.log(new_load);
  for(i = 0; i < new_load.length; i++) {
    Reading.create({
      temperature: new_load[i].temperature,
      turbidity: new_load[i].turbidity,
      conductivity: new_load[i].conductivity,
      pH: new_load[i].pH,
      timestamp: new_load[i].timestamp
    });
  }
  res.end();
});

/**
 * Handles the server request to retrieve n records from the database
 * Returns n records from the database... i hope these are most recent
 */
app.post('/api/data', function(req, res) {
  var n = parseInt(req.body.data);

  Reading.find().limit(n).exec(function(err, readingDetails) {
   // if there is an error retrieving, send the error. 
   // nothing after res.send(err) will execute
    if (err) 
    res.send(err);
      res.json(readingDetails); // return all nerds in JSON format
  });
});


app.get('/api/data', function(req, res) {
  //loads json from our current data file just as a test of json
  //this will not be necessary at all when the app.post function is
  //uncommented and working
  var new_load = data;
  for(i = 0; i < new_load.length; i++) {
    Reading.create({
      temperature: new_load[i].temperature,
      turbidity: new_load[i].turbidity,
      conductivity: new_load[i].conductivity,
      pH: new_load[i].pH,
      timestamp: new_load[i].timestamp
    });
  }

  /* To remove all data points in the thing */
  /*
  Reading.remove(function(err) {
    if(err)
      handleError(err);
  });
  */

  // use mongoose to get all nerds in the database
  Reading.find(function(err, readingDetails) {
   // if there is an error retrieving, send the error. 
   // nothing after res.send(err) will execute
   if (err) 
   res.send(err);
    res.json(readingDetails); // return all nerds in JSON format
  });
});



 // frontend routes =========================================================
 app.get('*', function(req, res) {
  res.sendfile('./public/login.html');
 });
}