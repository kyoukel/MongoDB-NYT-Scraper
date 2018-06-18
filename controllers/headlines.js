// Bring in the scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongoose models
var Headline = require("../models/Headline")

// deleting and saving functionality to use throughout project
module.exports = {

    // fetch object is going to grab all of my articles and insert them into the headline section of my mongo database

    // whenever I run fetch, pass cb into that ()
    fetch: functions(cb) {

        // then run scrape and set data to be called articles
        scrape(function (data) {
            var articles = data;

            // go through each article and run makeDate() to insert the date
            for (var i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();

                // and set saved to false on all of them
                articles[i].saved = false;
            }

            // run mongo. Take headline and insert into that collection lots of different articles, unordered
            Headline.collection.insertMany(articles, {
                ordered: false
            }, function (err, docs) {

                // and allows us to keep going if any errors.
                cb(err, docs);
            });
        });
    },
    // run delete function and remove whatever headline was queried.
    delete: function(query, cb) {
        Headline.remove(query, cb);
    },
    // find all headlines in query and sort most recent to least recent 
    get: function(query, cb) {
        Headline.find(query)
            .sort({
                _id: -1
            })
            // and pass all docs to cb ()
            .exec(function (err, doc) {
                cb(doc);
            });
    },

    // update any new articles scraped with relevant id and update any info passed to those articles with that info as well.
    update: function(query, cb) {
        Headline.update({
            _id: query._id
        }, {
            $set: query
        }, {}, cb);
    }
}