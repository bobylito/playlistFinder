const {dead} = require('../out.json');
const {deletePlaylist, connectToDB} = require('./lib/playlists');

const ora = require('ora');

async function removeDeadPlaylists() {
  const db = await connectToDB();
  const spinner = ora(`Removing ${dead.length} playlists`).start();
  for (playlistId of dead) {
    try {
      await deletePlaylist(db, playlistId);
    } catch (e) {
      console.error(e);
    }
  }
  spinner.succeed();
  process.exit(0);
}

removeDeadPlaylists();
