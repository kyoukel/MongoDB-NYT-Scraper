$(document).ready(function () {
            // Setting a reference to the article-container div where all the dyname content will go
            var articleCounter = $("article-container");

            // Adding event listeners to any dynamically generated "save article"
            $(document).on("click", "btn.save", handleArticleSave);

            // and "scrape new article" buttons
            $(document).on("click", ".scrape-new", handleArticleScrape);

            // Once the page is ready, run the initPage () to kick things off
            initPage();

            function initPage() {

                // Empty the article container, run an AJAX request for any unsaved headlines
                articleContainer.empty();
                    $.get("api/headlines?saved=false")
                        .then(function (data) {
                            // If we have headlines, render them to the page
                            if (data && data.length) {
                                renderArticles(data);
                            } else {
                                // Otherwise render a message explaining we have no articles
                                renderEmpty();
                            }
                        });
                }
            // This () handles appending HTML containing article data to the page
            function renderArticles(articles) {

                //  passing an array or JSON containing all avaialable articles in the database
                var articlePanels = [];

                // Pass each article JSON object to the createPanel () which returns a bootstrap panel with the article data inside
                for (var i = 0; i < articles.length; i++) {
                    articlePanels.push(createPanel(articles[i]));
                }
                // Once we have all of the HTML for the articles stored in articlePanels array, append them to the articlePanels container.
                articleContainer.append(articPanels);
            }

            function createPanel(article) {
                // This () takes in a single JSON object for an article/headline
                // It constructs a jQuery element containing all of the  formatting HTML for the article panel
                var panel = 
                    $(["<div class='panel panel-default'>",
                    "<div class='panel-heading'>",
                    "<h3>",
                    article.headline,
                    "<a class='btn btn-success save'>",
                    "Save Article",
                    "</a>",
                    "</h3>",
                    "</div>",
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
            
            function renderEmpty() {
                // This () renders some HTML to the page explaining we don't have any articles to view
                // Using a joined array of HTML string data because it's easier to read/change than a concatenated string.
                var emptyAlert = 
                    $(["<div class='alert alert-warning text-center'>","<h4>Uh Oh. Looks like we don't have any new articles.<h4>",
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
})