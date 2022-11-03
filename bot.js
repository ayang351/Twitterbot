// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// RETWEET FUNCTION TO RETWEET POST WITH #GordonRamsay
var retweets = {q: "#GordonRamsay", count: 10, result_type: "recent"}; 

function retweetLatest() {
	T.get('search/tweets', retweets, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// FUNCTION TO LIKE A POST
var LikeHashtags = ['#GordonRamsay', '#HellsKitchen', '#MasterChef', '#food'];
var value = Math.floor(Math.random() * LikeHashtags.length)

var likes = {
	q: LikeHashtags[value],
	count: 5,
	result_type: "recent"
};

T.get('search/tweets', likes,
	function(err, data, response) {	
		var likeId = data.statuses[0].id_str;
		T.post('favorites/create',{id:likeId},
		function(err, data, response) {
			console.log("just liked a post")});
	console.log(data);
	}
) 

//this function randomly tweets a gordon ramsay quote (Hemadri's portion)
var quotes = ["This lamb is so undercooked, it is following Mary to school",
 "This crab is so undercooked I can still hear it singing Under the Sea",
"I’ve never, ever, ever, ever, ever met someone I believe in as little as you.",
"My gran could do better! And she’s dead!",
"You don’t come into cooking to get rich.",
"I wouldn’t trust you running a bath",
"There’s enough garlic in here to kill every vampire in Europe",
"Why did the chicken cross the road? Because you didn’t cook it!",
"This fish is so raw, he’s still finding Nemo.",
"Cooking is about passion, so it may look slightly temperamental in a way that it’s too assertive to the naked eye",
"I think pressure’s healthy, and very few can handle it.",
"Hey, panini head, are you even listening to me?",
"This Pizza Is So Disgusting, If You take It To Italy, You'll Get Arrested.",
"You're Cooking In A Burnt Pan, You Donkey!"]
function tweetQuote() {
	var randomNum = Math.floor(Math.random() * (quotes.length - 0) + 0);
	console.log(randomNum);
	T. post ('statuses/update', {status: `${quotes[randomNum]}`},
	function(err, data, response) { 
		console.log(data) 
	} )
}
tweetQuote();
setInterval(tweetQuote, 1000 * 60 * 60);

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
