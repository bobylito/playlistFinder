var SpotifyWebApi = require('spotify-web-api-node');
var headƒ = require('lodash/head');
var tailƒ = require('lodash/tail');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : 'adcabe3ef23e4dad8b076644411eafa8',
  clientSecret : '49624fde3b894be989715bd46e88d3f6',
});

var users = require('../users.js');

console.log('Testing ' + users.length + 'users in `users.js`');

(function fetchNextUser(users, report) {
  if(users.length === 0) {
    printReport(report);
    return;
  }
  var currentUser = headƒ(users);
  testUser(currentUser, report).then(function() {
    fetchNextUser(tailƒ(users), report);
  });
})(users, {ok: [], error: []});

function printReport(report) {
  if (report.error.length === 0) console.log('All good!');
  else {
    console.error('Some users could not be found: ');
    console.error(report.error.join(', '));
  }
}

function testUser(user, report) {
  return spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      return spotifyApi.getUser(user);
    }).then(function(pl) {
      console.log('\x1b[30m\x1b[42mOK:\x1b[0m ' + user)
      report.ok.push(user);
    }, function(e) {
      console.log('\x1b[30m\x1b[41mNot OK:\x1b[0m ' + user);
      console.error(e);
      report.error.push(user);
      // throw e;
    });
}
