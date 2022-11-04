// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// RETWEET FUNCTION TO RETWEET POST WITH #GordonRamsay
var retweets = {q: "#GordonRamsay", count: 10, result_type: "recent"}; 

function retweetLatest() {
	T.get('search/tweets', retweets, function (error, data) {
	  console.log(error, data);
	  if (!error) {
		var retweetId = data.statuses[0].id_str;
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('retweet successful')
			}
			if (error) {
				console.log('retweet unsuccessful', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

retweetLatest();
setInterval(retweetLatest, 1000 * 60 * 60);

var LikeHashtags = ['#GordonRamsay', '#HellsKitchen', '#MasterChef', '#food', '#GordonRamsayRestaurants'];
// FUNCTION TO LIKE A POST
function LikePost() {
var value = Math.floor(Math.random() * LikeHashtags.length);

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
	}) 
}
//LikePost function call
ListPost();
setInterval(LikePost, 1000 * 60 * 60);



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

// post a random image (Hemadri) 
var memes = ["meme1.jpeg", "meme2.png", "meme3.jpeg", "meme4.png","meme5.jpeg", "meme6.jpeg", "meme7,jpeg","meme8.jpeg", "meme9.jpeg"];
function postMeme() {
	var randomNum2 = Math.floor(Math.random() * (memes.length - 0) + 0);
	console.log(randomNum2);
	var config = require('./config')
var fs = require('fs');
var tt = new Twit(config);
var b64content = fs.readFileSync(`./images/${memes[randomNum2]}`, {encoding: 'base64'})
	tt.post('media/upload', {media_data: b64content}, function (err, data, response) {
		console.log("Pic is posted");
		var mediaIdStr = data.media_id_string;
		var altText = `Gordon Meme ${randomNum2}`
		var meta_params = {media_id: mediaIdStr, alt_text: {text: altText}}

		tt.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
				var params = {status: `random gordon meme:`, media_ids: [mediaIdStr]}
				T.post('statuses/update', params, function (err, data, response) {
					console.log(data)
				})
			}
		})
			
		})
	}

postMeme();

//IN-PROGRESS --> FUNCTION TO FOLLOW BACK ALL FOLLOWERS OF @GORDANSEYRAM
function FollowBack() {
	var GordanSeyRamAccount = {
		screen_name: 'GordanSeyRam'
	}
	T.get('followers/ids', GordanSeyRamAccount, gotData2);
	
	function gotData2(err, data, response) {
		for (var i = 0; i < data.ids.length; i++) {
			T.post('friendships/create', {user_id: data.ids[i], follow: "true"}, function(err, response){
				if (err) {
				  console.log("Unsuccessful!");
				}
			});
		}
	}
}
//FollowBack function call
FollowBack();
setInterval(FollowBack, 1000 * 60 * 60);

//FUNCTION TO RESPOND TO @MENTION WITH A FOOD RATING + REVIEW

const ratings = ["-1000/10", "1/10", "0/10", "-99999/10", "2/10", "wtf/10", "-100/10", "-900/10"];
const reviews = ["I wouldn't even feed that to my dog", "I didn't know you can tweet from prison",
"My gran could do better! And she’s dead!", "You used so much oil, the U.S. want to invade the f—ing plate.",
"Salmonella is not an ingredient", "Is your mom upset with you ? What do you call that ?", "That looks disgusting",
"IT'S RAWWW", "Oh for god's sake man!", "NO YOU DONUT!!"];

function foodRating() {
	T.get('statuses/mentions_timeline', { count: 5, include_rts: 1}, gotData);
	function gotData(err, data, response) {
		for (var i = 0; i < data.length; i++) {
			var tweeter = data[i].user.screen_name;
			var randomCombination = ratings[Math.floor(Math.random() * ratings.length)] + " " + reviews[Math.floor(Math.random() * reviews.length)];
			var replyText = {
				status: '@' + tweeter + ' ' + randomCombination, 
			}
			T.post('statuses/update', replyText, function(err, reply) {
				if (err) {
					console.log("something went wrong");
				} else {
					console.log("request complete");
				}
			})
			
		}
	} 
}
//foodRating function call 
foodRating();
setInterval(foodRating,  1000 * 60 * 60);
