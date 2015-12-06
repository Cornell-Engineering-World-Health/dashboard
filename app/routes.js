//importing our Reading model, which has a predefined schema you can see in Readings.js
var mongoose       = require('mongoose');
var Reading        = require('./models/Readings.js');
var data           = require('./data.json');
//var bodyParser     = require('body-parser')
module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route

/*
app.use(bodyParser.json());
app.use(bodyParser.urlEncoded({extended: true}));

app.post('/', function(req, res)) {
  var new_load = req.body.data;
  for(i = 0; i < new_load.length; i++) {
    Reading.create({
      temperature: new_load[i].temperature,
      turbidity: new_load[i].turbidity,
      conductivity: new_load[i].conductivity,
      pH: new_load[i].pH,
      timestamp: new_load[i].timestamp,
    });
  }
}
*/
var new_load = new Array();

app.get('/api/data', function(req, res) {
  //loads json from our current data file just as a test of json
  var new_load = data;
  //var new_load = JSON.parse(data);
  /*for(i = 0; i < new_load.length; i++) {
    Reading.create({
      temperature: new_load[i].temperature,
      turbidity: new_load[i].turbidity,
      conductivity: new_load[i].conductivity,
      pH: new_load[i].pH,
      timestamp: new_load[i].timestamp,
    });
  }
  */

  for(i = 0; i < new_load.length; i++) {
    Reading.create({
      temperature: new_load[i].temperature,
      turbidity: new_load[i].turbidity,
      conductivity: new_load[i].conductivity,
      pH: new_load[i].pH,
      timestamp: new_load[i].timestamp,
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