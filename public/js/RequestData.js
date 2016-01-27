//RequestData.js

/**
 * precondition: none
 * postcondition: [getRecent n]returns the n most recent records in the
 *                database if there are less than n records, returns however
 *                many there are
 */              
getRecent = function(n) {
  $.post("/api/data", {data: n}, function(data) {
    return data;
  });
}

/**
 * precondition: json is a valid json that fits the Readings schema
 * postcondition: [add json] adds the records in the json to the database
 */   
add = function(json) {
  $.post("/", {data: json}, function(data) {
    return data;
  }); 
}