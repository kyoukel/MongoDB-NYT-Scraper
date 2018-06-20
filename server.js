// Require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();

// Set up an Express Router
var router = express.Router();

// Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Require our routes file, pass our router object
require("./config/routes")(router);

// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

// Have every request go through our router middleware
app.use(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// HW INSTRUCTIONS SAY TO USE THE CODE BELOW, BUT IT DOESN'T WORK
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

mongoose.connect(db, function(error) {
    if(error) {
        console.log(error);
    }
    else {
        console.log("mongoose connection is successful");
    }
});

// Listen on the port
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});