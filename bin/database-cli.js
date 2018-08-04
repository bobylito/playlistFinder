const fs = require('fs');

const command = process.argv[2];

if(!command) {
  console.error('Missing command');
  process.exit(1);
}

switch(command) {
  case 'list':
    listAllUsers();
    break;
  case 'add':
  case 'remove':
    const userID = process.argv[3];
    if(!userID) {
      console.error('You should provide a user id');
      process.exit(2);
    }
    if(command === 'add') addUser(userID);
    else removeUser(userID);
    break;
  case 'import':
    process.stdin.pipe(require('split')()).on('data', processLine)

    function processLine (line) {
      addUser(line);
    }
    break;
  case 'reset':
    resetList();
    break;
  default:
    console.error('Unknown command');
    process.exit(3);
}

function listAllUsers() {
  const usersData = require('../data/users.json');
  if(usersData && usersData.length > 0) {
    const users = usersData.sort();
    console.log(`Displaying ${users.length} playlists curators`);
    users.forEach(u => console.log(u));
  } else {
    console.log('No users found in the list of curators');
  }
}

function addUser(user) {
  const usersData = require('../data/users.json');
  const isUserAlreadyInList = isUserInList(usersData, user);
  if(isUserAlreadyInList) {
    console.log(`User "${user}" already in the list of curators`);
  } else {
    usersData.push(user);
    writeUsers(usersData);
    console.log(`User "${user}" added to the list of curators`);
  }
}

function removeUser(user) {
  const usersData = require('../data/users.json');
  const isUserAlreadyInList = isUserInList(usersData, user);
  if(!isUserAlreadyInList) {
    console.log(`User "${user}" not in the list of curators`);
  } else {
    const pos = usersData.indexOf(user);
    usersData.splice(pos, 1);
    writeUsers(usersData);
    console.log(`User "${user}" removed from the list of curators`);
  }
}

function writeUsers(users) {
  const fd = fs.openSync('data/users.json', 'w');
  fs.writeSync(fd, JSON.stringify(users.sort(), null, 2));
  fs.closeSync(fd);
}

function resetList() {
  const oldList = require('../scrapper/users.js');
  writeUsers(oldList);
}

function isUserInList(users, user) {
  return users.indexOf(user) !== -1; 
}
