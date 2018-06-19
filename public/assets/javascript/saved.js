$(document).ready(function() {
    // Getting a reference to the article container div we will be rendering all articles inside of
    var articleContainer = $("article-container");
    
    // Adding event listeners for dynamically generated buttons for deleting articles, pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", "btn.delete", handleArticleDelete);
    $(document).on("click", "btn.notes", handleArticleNotes);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", "btn.note-delete", handleNoteDelete);

    // initPage kicks everything off when the page is loaded
    initPage();

    function initPage() {
        // Empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data) {
            if (data && data.length) {
                renderArticles(data);
            } else {
                // Otherwise render a message explaining we have no articles
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        // This () handles appending HTML containing the article data to the page that's passed an array of JSON containing all available articles in our database
        var articlePanels = [];
        // Pass each article JSON object to the createPanel () which returns a bootstrap panel with the article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
    }

    function renderEmpty() {
        
        // This () renders some HTML to the page explaining that there are no articles to view
        // Using a joined array of HTML string data because it's easier to read/change than a concatenated string.
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>", "<h4>Uh Oh. Looks like we don't have any new articles.<h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What Would You Like to Do?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        
            // Appending this data to the page
        articleContainer.append(emptyAlert);
    }

    function createPanel(article) {
        
        // This () takes in a single JSON object for an article/headline
        // It constructs a jQuery element containing all of the  formatting HTML for the article panel
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-danger delete'>",
                "Delete from Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
                "</h3>",
                "<div class='panel-=body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));

        // Attach the article's id to the jQuery element
        // Will use when trying to figure out which article the user wants to save
        panel.data("_id", article._id);
        
        // Return the constructed panel jQuery element
        return panel;
    }

    function renderNotesList(data) {
        // This () handles rendering note list items to the notes modal
        // Setting up an array of notes to render after finished
        // Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            // If there are no notes, just display a message explaining this
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            // If there are no notes, go through each one
            for (var i = 0; i < data.notes.length; i++) {
                // Constructs on li element to contain the noteText and a delete button
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                // Store the note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                // Adding the currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        // This () is triggered when the user wants to delete an article/headlines
        // Grab the id of the article to delete from the panel element the delete button sits inside
        var articleToDelete = $(this).parents(".panel").data();
        
        // Using the delete method here just to be semantic since we are deleting an article/healine
        $.ajax({
            method: "DELETE",
            url: "/api/headlines" + articleToDelete._id
        }).then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        // This () handles opening the notes modal and displaying our notes
        // Grab the id of the article to get notes from the panel element the delete button sits inside
        var currentArticle = $(this).parents(".panel").data();
        // Grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            // Constructing the initial HMTL to add to the notes modal
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            // Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // Adding some information about the article and article notes tot he save button for easy access when trying to add a new note
            $(".btn.save").data("article", noteData);
            // renderNotesList will populate the actual note HTML inside of the modal just created/opened
            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
        // This () handles what happens when a user tried to save a new note for an article
        // Setting a variable to hold some formatted data about the note,
        // Grabbing the note types into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        // If there is actual data typed into the note input field, format it
        // and post it to the "/api/notes" route and send the formaatted noteData as well
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                // When complete, close the modal
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        // This () handles the deletion of notes
        // First grab the id of the note we want to delete
        // We stored this data on the delete button when we created it
        var noteToDelete = $(this).data("_id");
        // Perform DELETE request to "/api/notes/" with the id of the note being deleted as a parameter
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            // When done, hide the modal
            bootbox.hideAll();
        });
    }
});