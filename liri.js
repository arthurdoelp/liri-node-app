require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require('moment');
moment().format();

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var value = "";

var nodeArgs = process.argv;

for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        value = value + "+" + nodeArgs[i];
    }
    else {
        value += nodeArgs[i];
    }
}

switch (action) {
    case "concert-this":
        concertThis();
        break;
    
    case "spotify-this-song":
        spotifyThisSong();
        break;
    
    case "movie-this":
        movieThis();
        break;
    
    case "do-what-it-says":
        doWhatItSays();
        break;
    }

 function concertThis() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(function(response) {


        for (var i = 0; i < response.data.length; i++) {
            var formattedDate = response.data[i].datetime.slice(0,10);
            var randomDate = formattedDate;
            var randomFormat = "YYYY/MM/DD";
            var convertedDate = moment(randomDate, randomFormat);

            console.log(convertedDate.format("MM/DD/YYYY"));
            console.log((response.data[i].venue.city) + ", " + (response.data[i].venue.country));
            console.log(response.data[i].venue.name);
            console.log("-----------------------");
        }
    }); 
 };

function spotifyThisSong() {
    spotify.search({ type: 'track', query: value }, function(err, response) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var results = response.tracks.items;
        for (var i = 0; i < results.length; i++) {
            console.log("Artist: " + results[i].album.artists[0].name);
            console.log("Song: " + results[i].name);
            console.log("Preview Link: " + results[i].album.external_urls.spotify);
            console.log("Album: " + results[i].album.name);
            console.log("-----------------------");
        }
});
}

function movieThis() {
    var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(function(response) {
        console.log("-----------------------------");
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDB: " + response.data.Ratings[2].Value);
        console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("-----------------------------");
    });

};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
    
        data = data.split(",");
    
        action = data[0];
        console.log(action);
        value = data[1];
        console.log(value);

        switch (action) {
            case "concert-this":
                concertThis();
                break;
            
            case "spotify-this-song":
                spotifyThisSong();
                break;
            
            case "movie-this":
                movieThis();
                break;
            
            case "do-what-it-says":
                doWhatItSays();
                break;
            }
    });
}









