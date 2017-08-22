// assign all required npm and fs variable
var keys = require("./key.js");
var request = require("request");
var spotify = require('node-spotify-api');
var twitter = require('twitter');
var fs = require("fs");

// setting variables for twitter API
var twitterKey = keys.twitterKeys.consumer_key;
var twitterSecret = keys.twitterKeys.consumer_secret;
var twitterTokenKey = keys.twitterKeys.access_token_key;
var twitterTokenSecret = keys.twitterKeys.access_token_secret;

// add all the requirement for twitter API
var client = new twitter({
	consumer_key: twitterKey,
	consumer_secret: twitterSecret,
	access_token_key: twitterTokenKey,
	access_token_secret: twitterTokenSecret
});
var params = { screen_name: 'Joe Hart', count: 20 };

// setting variables and add all the requirement for spotify API
var spotifyId = keys.spotify.client_id;
var spotifySecret = keys.spotify.client_secret;
var spotify = new spotify({
  id: spotifyId,
  secret: spotifySecret
});

// set input variable from user input
var action = process.argv[2];
var arg = process.argv;
var input = "";
for (let i = 3; i < arg.length; i++) {
	if (i > 3 && i < arg.length) {
		input = input + "+" + arg[i];
	}
	else {
		input += arg[i];
	}
}

// function for logging result to log.txt and console log all items
function log(log) {
	console.log(log);
	fs.appendFile("log.txt",log + "\n", function(err) {
		if (err) {
			console.log(err);
		}
	});
}

// list of commands for liri
switch (action) {
  case "movie-this":
  	log("----------------------------------------------------------------------------------------------------");
 	movie();
    break;
  case "spotify-this-song":
  	log("----------------------------------------------------------------------------------------------------");
	spotifies();
    break;
  case "my-tweets":
  	log("----------------------------------------------------------------------------------------------------");
	tweet();
	break;
  case "do-what-it-says":
  	log("----------------------------------------------------------------------------------------------------");
	doit();
    break;
}

// execute OMDB API
function movie(){
	if (!input) {
		input="Mr. Nobody";
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
		log("Title: " + JSON.parse(body).Title);
		log("Year: " + JSON.parse(body).Year);
		log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
		log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		log("Country: " + JSON.parse(body).Country);
		log("Language: " + JSON.parse(body).Language);
		log("Plot: " + JSON.parse(body).Plot);
		log("Actors: " + JSON.parse(body).Actors);
		}
	});
}
// end function movie

// execute SPOTIFY API
function spotifies() {
	if (!input) {
		input = "track:The Sign artist:Ace of Base";
	}
	spotify.search({ type: 'track', query: input }, function(err, data) {
		if (err) {
			return log('Error occurred: ' + err);
		}
		log("Artist: " + data.tracks.items[0].artists[0].name);
		log("The song's name: " + data.tracks.items[0].name);
		log("A preview link: " + data.tracks.items[0].external_urls.spotify);
		log("The album: " + data.tracks.items[0].album.name);
	});
}
// end function spotify

// execute TWITTER API !!
function tweet() {
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	if (!error) {
		for (let i = 0; i < tweets.length; i++) {
			log('Tweets: ' + tweets[i].text + "--- Created at: " + tweets[i].created_at);
			};
		};
	});
}
// end function tweet

// execute DO-WHAT-IT-SAYS command
function doit() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return log(error);
		}
		var dataArr = data.split(',');
		input = dataArr[1];
		spotifies();
  });
}
// end function doit