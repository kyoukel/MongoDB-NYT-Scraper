# MongoDB-NYT-Scraper || All the News That's Fit to Scrape

## Overview
Create a web app that lets users view and leave comments on the latest news. But you're not going to actually write any articles; instead, you'll flex your Mongoose and Cheerio muscles to scrape news from another site.

### This GitHub repo requires you to run npm init. When that's finished, install and save these npm packages:
- [x] express
- [x] express-handlebars
- [x] mongoose
- [x] body-parser
- [x] cheerio
- [x] request

## To run this app, do the following:

1. Clone this repo to your computer and open the folder in Visual Studio Code.
2. Open your terminal and type `npm install` and press enter.
3. Open another terminal/GitBash`cd` into the `NewsScraper` folder.
4. Run mongoDB and listen to the PORT by typing `mongod` and press enter.
5. In the terminal, type node `server.js`.
6. Open your browser and type `localhost:3000` into the URL.

## Create an app that accomplishes the following:
- [x] Whenever a user visits this site, the app should scrape stories from a news outlet of your choice and display them for the user. 
- [x] Each scraped article should be saved to your application database. 
- [x] At a minimum, the app should scrape and display the following information for each article:

 * Headline - the title of the article
 * Summary - a short summary of the article
 * URL - the url to the original article

- [x] Users should also be able to leave comments on the articles displayed and revisit them later. 
- [x] The comments should be saved to the database as well and associated with their articles. 
- [x] Users should also be able to delete comments left on articles. 
- [x] All stored comments should be visible to every user.

## Happy Scraping!