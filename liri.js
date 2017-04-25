/**
Liri


 */


'use strict';

var fs = require('fs');

var request = require('request');
var inquirer = require('inquirer');
var spotify = require('spotify');


//Twitter keys loaded from keys.js
var keys = require('./keys.js');
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});



// ** for reference in case I ---- forget https://github.com/desmondmorris/node-twitter
function grabMyTweets() {

    var params = {screen_name: 'LarkinJamesJ', count: 20};

    client.get('statuses/user_timeline', params, function(err, tweets, response) {

        if (err) {
            console.log('Error occurred: ' + err);
            return;

        } else  {

            for(let i=0;i<tweets.length;i++) {
                console.log("Tweet: " + tweets[i].text );
                console.log(" --Created at: " + tweets[i].created_at);
            };
        }
    });
}


function prompt(user) {
    if (user.technology === 'spotify-this-song') {
        searchSpotify(user);

    } else if (user.technology === 'movie-this') {
        searchOMDB(user);

    } else if (user.technology === 'my-tweets') {
        grabMyTweets();

    } else {

        fs.readFile('./random.txt', 'utf8', function(err, data) {

            if (err) {
                console.log(err);
            } else {

                var output = data.split(',');

                user.technology = output[0];
                user.search = output[1];

                prompt(user);
            }
        });
    }


    var logTxt = 'A user entered: ' + user.technology + ' ' + user.search + '\n';

    fs.appendFile('log.txt', logTxt);
}


inquirer.prompt([
    {
        type: 'list',
        message: 'How can I help you?',
        choices: ['spotify-this-song', 'my-tweets', 'movie-this', 'do-what-it-says'],
        name: 'technology'
    }
]).then(function (user) {

        prompt(user);

        console.log('************************************');

});
