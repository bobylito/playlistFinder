var fs = require("fs");
var path = require("path");
var algolia = require("algoliasearch");

if (!process.env.ALGOLIA_APPLICATION_ID)
  throw new Error("ALGOLIA_APPLICATION_ID must be defined");
if (!process.env.ALGOLIA_ADMIN_KEY)
  throw new Error("ALGOLIA_ADMIN_KEY must be defined");

var appID = process.env.ALGOLIA_APPLICATION_ID;
var apiKey = process.env.ALGOLIA_ADMIN_KEY;

var client = algolia(appID, apiKey, { timeout: 60000 });

var indexName = "spotify-search";

var folderName = "playlists";
var datasets = fs.readdirSync(folderName);

var aggregatedPlaylists = aggregatePlaylists(datasets);

console.log("Uploading " + aggregatedPlaylists.length + " playlists");

uploadDataWithClear(indexName, aggregatedPlaylists);

function uploadDataWithClear(indexName, toUpload) {
  var index = client.initIndex(indexName);
  console.log("clearing index");
  index
    .clearIndex()
    .then(content => index.waitTask(content.taskID))
    .then(() => uploadRec(index, toUpload))
    .catch(e => console.error(e));
}

function uploadRec(index, data) {
  var slice = data.splice(0, 10000);
  if (slice.length === 0) return Promise.resolve();

  console.log("Sending to Algolia - " + slice.length + " records");
  return index
    .addObjects(slice)
    .then(content => index.waitTask(content.taskID))
    .then(() => uploadRec(index, data));
}

function uploadData(indexName, toUpload) {
  var index = client.initIndex(indexName);
  console.log("Sending to Algolia - " + toUpload.length + " records");
  index.addObjects(toUpload);
}

function aggregatePlaylists(datasets) {
  var alreadyUploaded = {};
  var toUpload = [];

  datasets.forEach(function(f) {
    var filePath = path.join(folderName, f);
    console.log("[" + filePath + "] processing");
    var objects = JSON.parse(fs.readFileSync(filePath));
    var deduped = deduplicate(objects, alreadyUploaded);
    toUpload = toUpload.concat(deduped);
  });

  return addObjectId(toUpload);
}

function deduplicate(objects, alreadyUploaded) {
  return objects.reduce(function(toUpload, pl) {
    if (!alreadyUploaded[pl.href]) {
      alreadyUploaded[pl.href] = true;
      toUpload.push(pl);
    } else {
    }
    return toUpload;
  }, []);
}

function addObjectId(objects) {
  return objects.map(function(o) {
    o.objectID = o.id;
    return o;
  });
}
