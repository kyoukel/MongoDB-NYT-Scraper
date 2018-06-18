// Controller for the notes
// ========================

// Bring in Note model and makeDate function
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    // grab all notes associated with articles created by users
    get: function(data, cb) {
        // find all notes associated with the headline id in question
        Note.find({
            headline: data._id
        }, cb);
    },
    // taking in data from user and cb ()
    save: function(data, cb) {

        // create object newNote
        var newNote = {
            
            // takes headline id associated with the note created 
            _headlineId: data._id,
            // with that date
            date: makeDate(),
            // and user text
            noteText: data.noteText
        };
        // takes the note and creates new note
        Note.create(newNote, function (err, doc) {
            
            // runs function to return error 
            if (err) {
                console.log(err);
            }
            // or a document with the cb ()
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },
    // remove notes associated with that article
    delete: function(data, cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }
};