// Server routes
// =============

// Bring in the Scrape () from our scripts directory
var scrape = require("../scripts/scrape");

// Bring headlines and notes from the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
    // This route renders the homepage
    router.get("/", function(req, res) {
        console.log("hit home?");
        res.render("home");
    });
    // This route renders the saved handlebars page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });

    // whenever we get the route api/fetch run this ()
    router.get("/api/fetch", function (req, res) {

        // go to headlinesController and run fetch
        headlinesController.fetch(function(err, docs) {
        
            // pop up message to user if no articles added or at all
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            }
            // Otherwise, tell user how many documents were added
            else {
                res.json ({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
    // whever the router hits api headlines, take in user request and respond appropriately
    router.get("/api/headlines", function(req, res) {
        var query = {};

        // if user specifies saved article or any specific parameter, set query specific to that request
        if (req.query.saved) {
            query = req.query;
        }

        headlinesController.get(query, function(data){
            // if user doesn't specify anything, return everything.
            res.json(data);
        });
    });
    // Route to delete specific article: Using api headlines then setting a paramater at the end to that headline id
    router.delete("/api/headlines/:id", function(req, res){

        // lank query
        var query = {};

        // set query to request params id
        query._id = req.params.id;

        // pass that into headlinesController delete () 
        headlinesController.delete(query, function(err, data){
            
            // and respond with data
            res.json(data);
        });
    });
    // Route to update headlines, if needed.
    router.patch("/api/headlines", function(req, res) {

        // run headlinesController update () on whatever the user sends in their request
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    // On our notes associated with that headline id, run a route
    router.get("/api/notes/:headline_id?", function(req, res){
        // query is blank unless user specifies request
        var query = {};
        // if user specifies, then set query to equal the param that they set
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }
        // then use get () on notesController, pass in that query with the specific param they chose, and pass in that data associated with that and a response we can use on the frontend
        notesController.get(query, function(err, data){
            res.json(data);
        });
    });

    router.delete("/api/notes/:id", function(req, res){
        var query = {};
        query._id = req.paramas.id;
        // run delete () based on query user chose
        notesController.delete(query, function(err, data){
            // return that data in json format to be used on the frontend
            res.json(data);
        });
    });
    // route to post new notes to articles
    router.post("/api/notes", function(req, res){
        // run notesControll save (), uses what the user requested in req.body 
        notesController.save(req.body, function(data) {
            // and returns the data in json format
            res.json(data);
        });
    });
}