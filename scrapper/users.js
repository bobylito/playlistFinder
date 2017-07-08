var curators = require('./users_42curators.js');
var others = require('./users_others.js');
var spotify = require('./users_spotify.js');
var feb2017 = require('./users_022017.js');
var mtv = require('./users_mtv.js');

module.exports = curators.concat(others, spotify, feb2017, mtv);
