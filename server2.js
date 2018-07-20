var cheerio = require("cheerio");
var request = require("request");

// First, tell the console what server2.js is doing
console.log("\n******************************************\n" +
            "Grabbing every article headline and link\n" +
            "from the NHL website:" +
            "\n******************************************\n");

// Making a request for `nhl.com`'s homepage
request("https://riotfest.org/", function(error, response, html) {

  // Load the body of the HTML into cheerio
  var $ = cheerio.load(html);

  // Empty array to save our scraped data
  var results = [];

  // Loops through the results
  $("article.type-post").each(function(i, element) {

    // Save the text of the h5 class as "title"
    var title = $(element).find(".entry-title").text();

    // Find the h5 tag's child a-tag, and save it's href value as "link"
    var link = $(element).find(".entry-title").children().attr("href");

    // Finds the summary for each article as "summary"
    var summary = $(element).find(".entry-excerpt-container").text();

    // Make an object with data and push it to the results array
    results.push({
      title: title,
      link: link,
      summary: summary
    });
  });

  // Logs the results
  console.log(results);
});
