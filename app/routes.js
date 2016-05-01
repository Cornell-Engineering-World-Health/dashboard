//importing our Reading model, which has a predefined schema you can see in Readings.js
var mongoose       = require('mongoose');
var Reading        = require('./models/Readings.js');
var Usage          = require('./models/Usage.js');
var data           = require('./data.json');
var bodyParser     = require('body-parser');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route

var new_load = new Array();

//this should be how we add to the database from now on
/*
app.use(bodyParser.json());
app.use(bodyParser.urlEncoded({extended: true}));
*/
app.post('/load/WaterQuality', function(req, res) {
  var new_load = req.body;
  var return_string = "success";
  for(i = 0; i < new_load.length; i++) {
    new_load[i].timestamp = new Date(new_load[i].timestamp);
  }
  Reading.create(new_load, function(err, added) {
    if(err)
      res.send(err);
    res.json(added);
  });
});

app.post('/load/Usage', function(req, res) {
  var new_load = req.body;
  var return_string = "success\n";
  for(i = 0; i < new_load.length; i++) {
    new_load[i].timestamp = new Date(new_load[i].timestamp);
  }
  Usage.create(new_load, function(err, added) {
    if(err)
      res.send(err);
    res.json(added);
  });
});
/**
 * Handles the server request to retrieve n records from the database
 * Returns n records from the database... i hope these are most recent
 */
app.post('/api/data/WaterQuality', function(req, res) {
  var n = parseInt(req.body.data);

  Reading.find().sort({timestamp : -1}).limit(n).exec(function(err, readingDetails) {
   // if there is an error retrieving, send the error. 
   // nothing after res.send(err) will execute
    if (err) 
    res.send(err);
      res.json(readingDetails); // return all nerds in JSON format
  });
});

/**
 * Handles the server request to retrieve n records from the database
 * Returns n records from the database... i hope these are most recent
 */
app.post('/api/data/Usage', function(req, res) {
  var n = parseInt(req.body.data);

  Usage.find().sort({timestamp : -1}).limit(n).exec(function(err, readingDetails) {
   // if there is an error retrieving, send the error. 
   // nothing after res.send(err) will execute
    if (err) 
    res.send(err);
      res.json(readingDetails); // return all nerds in JSON format
  });
});

app.get('/reset', function(req, res) {
  /* To remove all data points in the thing */
  Reading.remove(function(err) {
    if(err)
      handleError(err);
  });
  Usage.remove(function(err) {
    if(err)
      handleError(err);
  });
  
  //loads json from our current data file just as a test of json
  //this will not be necessary at all when the app.post function is
  //uncommented and working
  for(i = 0; i < data.waterQuality.length; i++) {
    Reading.create({
      temperature: data.waterQuality[i].temperature,
      turbidity: data.waterQuality[i].turbidity,
      conductivity: data.waterQuality[i].conductivity,
      sodium: data.waterQuality[i].sodium,
      magnesium: data.waterQuality[i].magnesium,
      calcium: data.waterQuality[i].calcium,
      pH: data.waterQuality[i].pH,
      timestamp: new Date(data.waterQuality[i].timestamp),
      usage: data.waterQuality[i].usage
    });
  }
  for(i = 0; i < data.usageData.length; i++) {
    Usage.create({
      timestamp: new Date(data.usageData[i].timestamp),
      usage: data.usageData[i].usage
    });
  }


  res.send("success");
});

app.get('/api/data/WaterQuality', function(req, res) {
  // use mongoose to get all nerds in the database
  Reading.find(function(err, readingDetails) {
   // if there is an error retrieving, send the error. 
   // nothing after res.send(err) will execute
   if (err) 
    res.send(err);
  res.json(readingDetails); // return all nerds in JSON format
  });
});

app.get('/api/data/Usage', function(req, res) {
  // use mongoose to get all nerds in the database
  Usage.find(function(err, usageDetails) {
   // if there is an error retrieving, send the error. 
   // nothing after res.send(err) will execute
   if (err) 
    res.send(err);
  res.json(usageDetails); // return all nerds in JSON format
  });
});



 // frontend routes =========================================================
 app.get('*', function(req, res) {
  res.sendfile('./public/login.html');
 });
}