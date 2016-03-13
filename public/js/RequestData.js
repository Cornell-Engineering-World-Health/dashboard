//RequestData.js

/**
 * precondition: none
 * postcondition: [getRecent n]returns the n most recent records in the
 *                database if there are less than n records, returns however
 *                many there are
 */              
getRecent = function(n, callback) {
  $.post("/api/data", {data: n}, function(res) {
    if(typeof callback === "function") {
      callback(res);
    }
  });
}

/**
 * precondition: json is a valid json that fits the Readings schema
 * postcondition: [add json] adds the records in the json to the database
 */   
add = function(json, callback) {
  $.post("/", {data: json}, function(res) {
    if(typeof callback === "function") {
      callback(res);
    }
  }); 
}

resetDB = function(callback) {
  $.get("/reset", function(res) {
    if(typeof callback === "function") {
      callback(res);
    }
  })
}