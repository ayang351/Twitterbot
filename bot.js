// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// Follows back anyone who mentions GordanSeyRam on twitter -- Scans for mentions every minute
function FollowSpam() {
	T.get('statuses/mentions_timeline', { count: 5, include_rts: 1}, gotData);
	function gotData(err, data, response) {
		for (var i = 0; i < data.length; i++) {
			var tweeter = data[i].user.screen_name;
            console.log(tweeter);
            if (tweeter == "GordanSeyRam") {
                break;
            } else {
                T.post('friendships/create', { screen_name: tweeter })
                .then(result => {

                console.log('Followed successfully!');
                }).catch(console.error);
            }
	    } 
    }
    
}

// Follows back any follower of GordanSeyRam -- Scans for followers every minute
function FollowBack() {
	var GordanSeyRamAccount = {
		screen_name: 'GordanSeyRam'
	}
	T.get('followers/ids', GordanSeyRamAccount, gotData2);
	
    function gotData2(err, data, response) {
		for (var i = 0; i < data.ids.length; i++) {
            console.log(data.ids[i]);
            T.post('friendships/create', { user_id: data.ids[i] })
                .then(result => {

                console.log('Followed successfully!');
                }).catch(console.error);
        }
	}
}

// Hashtags for Bot to scan
var LikeHashtags = ['#GordonRamsay', '#HellsKitchen', '#MasterChef', '#GordonRamsayRestaurants'];

// Likes a post once every ten minutes with one of the hashtags
function LikePost() {
    var value = Math.floor(Math.random() * LikeHashtags.length);

    var likes = {
    q: LikeHashtags[value],
    count: 5,
    result_type: "recent"
    };

    T.get('search/tweets', likes,
    function(err, data, response) {
        if (data.statuses[0] === undefined) {
            console.log("undefined");
        } else {
            var likeId = data.statuses[0].id_str;
            console.log(likeId)
            T.post('favorites/create',{id:likeId},
            function(err, data, response) {
                console.log("just liked a post")});
        }	
    }) 
}

// Array of famous Gordon Ramsay quotes
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

// Tweets a random Gordon Ramsay quote every four hours
function tweetQuote() {
	var randomNum = Math.floor(Math.random() * (quotes.length - 0) + 0);
	console.log(randomNum);
	T.post ('statuses/update', {status: `${quotes[randomNum]}`},
	function(err, data, response) { 
		console.log("quote posted!") 
	} )
}

var retweets = {q: "#GordonRamsay", count: 10, result_type: "recent"}; 

// Retweets a tweet hashtagged #GordonRamsay every four hours
function retweetLatest() {
	T.get('search/tweets', retweets, function (error, data) {
	  if (!error) {
		var retweetId = data.statuses[0].id_str;
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('retweet successful')
			}
			if (error) {
				console.log('retweet unsuccessful', error.message);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error.message);
	  }
	});
}

// Path names to images
var memes = ["meme1.jpeg", "meme2.png", "meme3.jpeg", "meme4.png","meme5.jpeg", "meme6.jpeg", "meme7.jpeg","meme8.jpeg", "meme9.jpeg"];

// Posts a Gordon Ramsay meme once a day
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
                    var params = {status: "hello", media_ids: [mediaIdStr]}
                    T.post('statuses/update', params, function (err, data, response) {
                        console.log(data.created_at)
                    })
                }
            })
                
        })
}

// Random reviews and ratings the bot will select from
const ratings = ["-1000/10", "1/10", "0/10", "-99999/10", "2/10", "wtf/10", "-100/10", "-900/10"];
const reviews = ["I wouldn't even feed that to my dog", "I didn't know you can tweet from prison",
"My gran could do better! And she’s dead!", "You used so much oil, the U.S. want to invade the f—ing plate.",
"Salmonella is not an ingredient", "Is your mom upset with you ? What do you call that ?", "That looks disgusting",
"IT'S RAWWW", "Oh for god's sake man!", "NO YOU DONUT!!"];

// Initialize Array to check against double replying
const replyArr = [];

// Replies to mentions with a rating and review
function foodRating() {
	T.get('statuses/mentions_timeline', { count: 3, include_rts: 1}, gotData);
	function gotData(err, data, response) {
        for (i= 0; i < data.length; i++) {
            var tweeter = data[i].user.screen_name;
            var tweeterId = data[i]["id_str"];
            var randomCombination = "@" + tweeter + " " + ratings[Math.floor(Math.random() * ratings.length)] + " " + reviews[Math.floor(Math.random() * reviews.length)];
            for (j = 0; j < replyArr.length; j++) {
                if (tweeterId == replyArr[j]) {
                    return;
                }
            }
            replyArr.push(tweeterId);
            console.log(tweeter);
            console.log(tweeterId);
            T.post('statuses/update', 
            
                { 
                in_reply_to_status_id : tweeterId,
                status: randomCombination,
                auto_populate_reply_metadata: true },
                
                function(err, reply) {
                if (err) {
                    console.log("something went wrong");
                } else {
                    console.log("request complete");
                }
            })
        }
        
    }
}

// Function Calls
foodRating(); // replies to the most recent mention as soon as the bot is activiated.
retweetLatest(); // retweets a #GordonRamsay post as soon as bot is activated
tweetQuote(); // tweets a quote as soon as bot is activiated
setInterval(FollowBack, 1000 * 60); // Scans for new followers every minute
setInterval(FollowSpam, 1000 * 60); // Scans for new replies every minute
setInterval(LikePost, 1000 * 60 * 10); // Likes a post every ten minutes
setInterval(tweetQuote, 1000 * 60 * 60 * 24); // Tweets a quote every day
setInterval(retweetLatest, 1000 * 60 * 60 * 4); // Retweets a #GordonRamsay post every four hours.
setInterval(postMeme, 1000 * 60 * 60 * 24); // Posts a meme once a day
setInterval(foodRating, 1000 * 60 * 5); // scans for a mention to reply to every 5 minutes.