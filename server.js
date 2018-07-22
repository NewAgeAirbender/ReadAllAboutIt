var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();
// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// parse application/json
app.use(bodyParser.json());
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    request("https://riotfest.org/", function (error, response, html) {

        // Load the body of the HTML into cheerio
        var $ = cheerio.load(html);

        // Now, we grab every article tag, and do the following:
        $("article.type-post").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text, href, and summary of every link, and save them as properties of the result object
            result.title = $(this).find(".entry-title").text();

            result.link = $(this).find(".entry-title").children().attr("href");

            result.summary = $(this).find(".entry-excerpt-container").text();

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// index route loads view.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/index.handlebars"));
});

// Route for getting all Articles from the db
app.get("/comments", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Comment.find({}, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included

    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});