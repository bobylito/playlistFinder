const algolia = require("algoliasearch");
const process = require("process");
const { getAllPlaylists, connectToDB } = require("./lib/playlists");
const ora = require("ora");

if (!process.env.ALGOLIA_APPLICATION_ID)
  throw new Error("ALGOLIA_APPLICATION_ID must be defined");
if (!process.env.ALGOLIA_ADMIN_KEY)
  throw new Error("ALGOLIA_ADMIN_KEY must be defined");

const appID = process.env.ALGOLIA_APPLICATION_ID;
const apiKey = process.env.ALGOLIA_ADMIN_KEY;

const client = algolia(appID, apiKey, { timeout: 60000 });

const indexName = "spotify-search";

function addObjectId(objects) {
  return objects.map(function(o) {
    o.objectID = o.id;
    return o;
  });
}

connectToDB().then(async db => {
  const index = client.initIndex(indexName);
  const genPlaylists = getAllPlaylists(db);
  for await (let pls of genPlaylists) {
    const spinner = ora(`Uploading ${pls.length} playlists`).start();
    const plsWithObjectID = addObjectId(pls);
    const { taskID } = await index.addObjects(plsWithObjectID);
    await index.waitTask(taskID);
    spinner.succeed();
  }
  process.exit(0);
});