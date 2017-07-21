var fs = require('fs');
var SpotifyWebApi = require('spotify-web-api-node');
var headƒ = require('lodash/head');
var tailƒ = require('lodash/tail');

if(!process.env.SPOTIFY_ID) throw new Error('SPOTIFY_ID must be defined');
if(!process.env.SPOTIFY_SECRET) throw new Error('SPOTIFY_SECRET must be defined');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_ID,
  clientSecret : process.env.SPOTIFY_SECRET,
});

// create playlists folder
try {
  fs.mkdir('playlists');
} catch(e) { /* ignore */ }

var rawusers = require('./users.js');
var totalPlaylists = 0;

(function fetchNextUser(users) {
  // console.log('Fetching playlists of ' + users.length + ' users');
  if(users.length === 0) {
    console.log(`Scrapping ended 💪: fetched ${totalPlaylists} playlists of ${rawusers.length} users}`);
    return;
  }
  var head = headƒ(users);
  scrapUserPlaylists(head).then(function() {
    fetchNextUser(tailƒ(users));
  });
})(rawusers)

function scrapUserPlaylists(user) {
  // console.log("Fetching playlists for: " + user);
  return spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);

      return getAllPlaylists(user)
        .then(getSongsAndArtistsForPlaylists)
        .then(getPlaylistFollowers);
    }).then(function(pl) {
      fs.writeFileSync('playlists/' + user + '.json', JSON.stringify(pl, null, 2));
      totalPlaylists += pl.length;
      console.log(pl.length + ' fetched playlists from ' + user);
    }, function(e) {
      console.error(e);
    });
}

function getPlaylistFollowers(playlists, processedPlaylists) {
  // console.log('[Followers] Playlist remaining to process: ', playlists.length);
  var newProcessedPlaylists = processedPlaylists || [];
  if(playlists.length === 0) return newProcessedPlaylists;

  var head = headƒ(playlists);
  return spotifyApi.getPlaylist(head.owner, head.id, {fields: 'followers(total),description'})
    .then(function(response) {
      var infos = response.body;
      head.followers = infos.followers.total;
      head.description = infos.description || '';
      newProcessedPlaylists.push(head);
      return getPlaylistFollowers(tailƒ(playlists), newProcessedPlaylists);
    }, function(e) {
      console.log(e);
      console.log('Error fetching followers and metadata - retrying in 10s');
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(getPlaylistFollowers(playlists, processedPlaylists));
        }, 10000);
      });
    });
}

function getSongsAndArtistsForPlaylists(playlists, processedPlaylists) {
  // console.log('[songs and artists] Playlist remaining to process: ', playlists.length);
  var newProcessedPlaylists = processedPlaylists || [];
  if(playlists.length === 0) return newProcessedPlaylists;

  var head = headƒ(playlists);
  return getSongsAndArtists(head)
    .then(function(songsAndArtists) {
      head.songs = songsAndArtists.songs;
      head.artists = songsAndArtists.artists;
      newProcessedPlaylists.push(head);
      return getSongsAndArtistsForPlaylists(tailƒ(playlists), newProcessedPlaylists);
    }, function(e) {
      console.log(e);
      if(e.statusCode === 404) {
        console.log('Error fetching song - Not found - skip');
        return getSongsAndArtistsForPlaylists(tailƒ(playlists), processedPlaylists);
      }
      else {
        console.log('Error fetching songs - retrying in 10s');
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve(getSongsAndArtistsForPlaylists(playlists, processedPlaylists));
          }, 10000);
        });
      }
    });
}

function getSongsAndArtists(pl, previousTracks, end) {
  if(end) return Promise.resolve(processSongsAndArtists(previousTracks));

  var tracks = previousTracks || [];
  return spotifyApi.getPlaylistTracks(pl.owner, pl.id, {fields: 'items(track(name,album(name),artists(name)))'})
    .then(function(response) {
      var body = response.body;
      //console.log(pl, tracks);
      var items = tracks.concat(body.items);
      if(body.next) return getSongsAndArtists(pl, items);
      else return getSongsAndArtists(pl, items, true);
    });
}

function processSongsAndArtists(tracks) {
  var artists = {};
  var songs = tracks.reduce(function(memo, container) {
    var track = container.track;
    if(track !== null) {
      track.artists.forEach(function(artist) {
        artists[artist.name] = artist.name;
      });
      memo.push(track.name);
    }
    return memo;
  }, []);
  return {
    songs: songs,
    artists: Object.keys(artists),
  };
}

function getAllPlaylists(userID, previousPlaylists, end) {
  if(end) return Promise.resolve(processPlaylists(previousPlaylists));

  var playlists = previousPlaylists || [];
  return spotifyApi.getUserPlaylists(userID, {
    limit: 50,
    offset: playlists.length
  }).then(function(response) {
    var body = response.body;
    if(body.next) return getAllPlaylists(userID, playlists.concat(body.items));
    else return getAllPlaylists(userID, playlists.concat(body.items), true);
  }, function(e) {
    console.log(e);
    console.log('Failed to fetch playlist for ' + userID + ' - retrying in 10s');
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(getAllPlaylists(userID, previousPlaylists));
      }, 10000);
    });
  });
}

function processPlaylists(pls) {
  return pls.map(function(pl) {
    return {
      id: pl.id,
      owner: pl.owner.id,
      ownerHref: pl.owner['external_urls'].spotify,
      name: pl.name,
      description: '',
      images: pl.images,
      followers: 0,
      songs: [],
      artists: [],
      href: pl['external_urls'].spotify
    };
  });
}
