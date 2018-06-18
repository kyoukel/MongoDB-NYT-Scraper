// scrape script
// =============

// Require request and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
   // use request pkg to request website with results
    request("http://www.nytimes.com", function(err, res, body){
   
    // load body text
    var $ = cheerio.load(body);

    var articles = [];

    // parent
    $(".theme-summary").each(function(i, element){

        // children of theme-summary: Grab the text and cutoff any white space at the end for head and sum variables
        var head = $(this).children(".story-heading").text().trim();
        var sum = $(this).children(".summary").text().trim();

        // if head and sum exist, scraper is successful.
        if(head && sum){

            // clean up text with whitespace.
            var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
            var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

            // makes an object and assigns it to healine and summary to create article in model
            var dataToAdd = {
                headline: headNeat,
                summary: sumNeat
            };
            // push new dataToAdd into articles array
            articles.push(dataToAdd);
        }
    });
    // once finished, callback sends back articles
    cb(articles);
   });
};

module.exports = scrape;