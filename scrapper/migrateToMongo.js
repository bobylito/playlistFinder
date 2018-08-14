const ora = require("ora");
const process = require("process");
const {
  connectToDB,
  closeDB,
  deduplicatePlaylists,
  readAllPlaylists,
  writePlaylist
} = require("./lib/playlists.js");

(async function main() {
  const spinnerLoad = ora(`Loading playlists from files`).start();
  const pls = await readAllPlaylists();
  spinnerLoad.succeed();

  console.log(`➡️ ${pls.length} playlist`);

  const [deduped] = deduplicatePlaylists(pls);

  console.log(`➡️ ${deduped.length} playlist after deduplication`);

  const spinner = ora("writing playlists").start();
  const db = await connectToDB();
  for(pl of deduped) {
    await writePlaylist(db, pl);
  }
  closeDB();
  spinner.succeed();

  process.exit(0);
})();
