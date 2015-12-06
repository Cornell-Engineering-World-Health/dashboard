//RequestData.js

//takes an integer n and makes a request to the server, which returns a 
//JSON file of the n most recent records in the database
var exports = module.exports = {}

exports.getRecent = function(n) {
  $.post("/api/data", {data: n}, function(data) {
    console.log(data);
  });
}