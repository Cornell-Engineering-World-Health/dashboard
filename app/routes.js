//importing our Reading model, which has a predefined schema you can see in Readings.js
var mongoose       = require('mongoose');
var Reading        = require('./models/Readings.js');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route

//dynamically generates the fake data
//fake data is loaded upon GET request
//you can see this data in http://localhost:8080/api/data
var new_load = new Array();

function push_new() {
  var today = new Date();
  var date = "" + (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

  new_load.push({
    temperature: Math.floor((Math.random() * 100) + 1),
    turbidity: Math.floor((Math.random() * 7) + 1),
    conductivity: Math.floor((Math.random() * 10) + 1),
    pH: Math.floor((Math.random() * 6) + 4),
    timestamp: date 
  });
}
setInterval(push_new, 1000);

app.get('/api/data', function(req, res) {
  
  for(i = 0; i < new_load.length; i++) {
    Reading.create({
      temperature: new_load[i].temperature,
      turbidity: new_load[i].turbidity,
      conductivity: new_load[i].conductivity,
      pH: new_load[i].pH,
      timestamp: new_load[i].timestamp,
    });
  }
  
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