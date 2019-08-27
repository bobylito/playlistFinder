var fs = require('fs');
var process = require('process');
var SpotifyWebApi = require('spotify-web-api-node');
var headƒ = require('lodash/head');
var tailƒ = require('lodash/tail');

const {connectToDB, closeDB, writePlaylist, getPlaylist} = require('./lib/playlists');

console.log('Playlist detective 🕵️ started!');

const maybeDB = connectToDB();

if(!process.env.SPOTIFY_ID) throw new Error('SPOTIFY_ID must be defined');
if(!process.env.SPOTIFY_SECRET) throw new Error('SPOTIFY_SECRET must be defined');

var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_ID,
  clientSecret : process.env.SPOTIFY_SECRET,
});

var commandLineUser = process.argv[2];

var rawusers;
if(commandLineUser) {
  console.log(`user "${commandLineUser}" provided directly - forcing single user processing`);
  rawusers = [commandLineUser];
} else {
  console.log('Using curators list defined in `data/users.json`');
  rawusers = require('../data/users.json');
  console.log(`Reading playlists of ${rawusers.length} users`);
}

// stats
var totalPlaylists = 0;
const stats = {
  start: Date.now(),
  end: undefined,
  new: [],
  updated: [],
  notUpdated: [],
};

// 0 - going through the list of curator one by one

(async function fetchNextUser(users) {
  if(users.length === 0) {
    stats.end = Date.now();
    const deltaT = (stats.end - stats.start) / 1000;
    const deltaMinutes = Math.floor(deltaT / 60);
    const deltaSeconds = deltaT % 60;
    console.log(`Scrapping ended in ${deltaMinutes} min. ${deltaSeconds} sec.
Summary:
     - fetched ${totalPlaylists} playlists of ${rawusers.length} users}
     - ${stats.new.length} new playlists
     - ${stats.updated.length} updated playlists
     - ${stats.notUpdated.length} not updated`);
    closeDB(await maybeDB);
    process.exit(0);
  }
  var head = headƒ(users);
  scrapUserPlaylists(head).then(function() {
    fetchNextUser(tailƒ(users));
  });
})(rawusers)

// 1 - fetch the user's playlist. Makes sure that we have the correct access token.

function scrapUserPlaylists(user) {
  return spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      spotifyApi.setAccessToken(data.body['access_token']);

      return getAllPlaylists(user)
        .then(filterNonUpdatedPlaylists)
        .then(getSongsAndArtistsForPlaylists)
        .then(getPlaylistFollowers)
        .then(writePlaylists);
    }).then(function(pl) {
      totalPlaylists += pl.length;
      console.log(pl.length + ' fetched playlists from ' + user);
    }, function(e) {
      console.error(e);
    });
}

// 2 - Actually fetches the user's playlist

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
  }, (e) => handleSpotifyAPIError(
      () => getAllPlaylists(userID, previousPlaylists),
      () => getAllPlaylists(userID, previousPlaylists, true), // why would it fail??
      e,
      `user playlists from ${userID}`,
    )
  );
}

// 2bis - process the list of playlists to their serialization format

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
      href: pl['external_urls'].spotify,
      snapshotId: pl['snapshot_id']
    };
  });
}

// 3 - Filter out playlists that are not updated (we keep the new and updated playlists)

/**
 * Go through a list of playlists and keep only the playlists that requires a complete update.
 * @param {Array<Object>} playlists 
 * @returns {Array<Object>}
 */
async function filterNonUpdatedPlaylists(playlists) {
  const newOrUpdatedPlaylists = [];
  for(let pl of playlists) {
    const db = await maybeDB;
    const playlistFromDB = await getPlaylist(db, pl.id);
    if(playlistFromDB && playlistFromDB.snapshotId !== pl.snapshotId) {
      newOrUpdatedPlaylists.push(pl);
      stats.updated.push(pl.id);
    } else if (!playlistFromDB) {
      newOrUpdatedPlaylists.push(pl);
      stats.new.push(pl.id);
    } else {
      stats.notUpdated.push(pl.id);
    }
  }
  return newOrUpdatedPlaylists;
}

// 4 - Iterates over the user's playlists to add the songs and artists

function getSongsAndArtistsForPlaylists(playlists, processedPlaylists) {
  var newProcessedPlaylists = processedPlaylists || [];
  if(playlists.length === 0) return newProcessedPlaylists;

  var head = headƒ(playlists);
  return getSongsAndArtists(head)
    .then(function(songsAndArtists) {
      head.songs = songsAndArtists.songs;
      head.artists = songsAndArtists.artists;
      newProcessedPlaylists.push(head);
      return getSongsAndArtistsForPlaylists(tailƒ(playlists), newProcessedPlaylists);
    }, (e) => handleSpotifyAPIError(
      () => getSongsAndArtistsForPlaylists(playlists, processedPlaylists),
      () => getSongsAndArtistsForPlaylists(tailƒ(playlists), processedPlaylists),
      e,
      `songs and artists for ${head.name} from ${head.owner}`,
    )
  );
}

// 5 - Get songs and artists for a single playlist

function getSongsAndArtists(pl, previousTracks, end) {
  if(end) return Promise.resolve(processSongsAndArtists(previousTracks));

  var tracks = previousTracks || [];
  return spotifyApi.getPlaylistTracks(pl.owner, pl.id, {fields: 'items(track(name,album(name),artists(name)))'})
    .then(function(response) {
      var body = response.body;
      var items = tracks.concat(body.items);
      if(body.next) return getSongsAndArtists(pl, items);
      else return getSongsAndArtists(pl, items, true);
    }, (e) => handleSpotifyAPIError(
      () => getSongsAndArtists(pl, previousTracks),
      () => getSongsAndArtists(pl, previousTracks, true),
      e,
      `songs and artists (browsing tracks) for ${pl.name} from ${pl.owner}`,
    )
  );
}

// 6 - Transforms songs into a list of unique artists and songs

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

// 7 - Adds the description and number of followers to the playlists

function getPlaylistFollowers(playlists, processedPlaylists) {
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
    }, (e) => handleSpotifyAPIError(
      () => getPlaylistFollowers(playlists, processedPlaylists),
      () => getPlaylistFollowers(tailƒ(playlists), processedPlaylists),
      e,
      `playlist followers for ${head.name} from ${head.owner}`,
    )
  );
}

// 8 - write playlists

async function writePlaylists(playlists) {
  const db = await maybeDB;
  for(let pl of playlists) {
    await writePlaylist(db, pl);
  }
  return playlists;
}

/**
 * Generic error handling for spotify HTTP errors
 * @param {function} functionRetry function to call when the error can be recovered
 * @param {function} functionSkip function to call when the error can NOT be recovered
 * @param {exception} e exception triggered by the spotify client
 * @param {*} callCtx string containing context about what happened. Useful to understand the reason or where it happened
 */
function handleSpotifyAPIError(functionRetry, functionSkip, e, callCtx) {
  if(e.statusCode === 429) {
    console.log(`Error fetching data - rate limit - ${callCtx} - retrying in 10s`);
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(functionRetry());
      }, 10000);
    });
  } else if(e.statusCode === 401) {
    console.log('Access token expired');
    return spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        spotifyApi.setAccessToken(data.body['access_token']);
        return functionRetry();
      })
  } else {
    console.log(`Error fetching data - other error (${e.statusCode}) - ${callCtx} - skipping`);
    return functionSkip();
  }
}
