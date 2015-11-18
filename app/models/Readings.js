//connection is the connection to the ewh database defined in server.js
//the following line of code exports the readings collection inside the ewh database
//module.exports allows us to pass this to other files when imported
var mongoose = require("mongoose");

module.exports = connection.model('Reading', new mongoose.Schema({temperature : Number, turbidity : Number, conductivity : Number, pH : Number, timestamp: String}));