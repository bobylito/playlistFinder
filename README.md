# playlistFinder

Search spotify playlist, powered by InstantSearch.js / Algolia. The project contains two parts:

- the scrapper fetch and index spotify playlists for a selection of known curators
- the webapp displays a search UI for the playlist indices

The web app is made using:

- [Gatsby.js](https://www.gatsbyjs.org/)
- [react-instantsearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/),

## Running the scrapper

Before running this part of the project, you need a spotify account and an
[algolia account](https://www.algolia.com/users/sign_in). You also need node.js and yarn.

Then you need to define the following environment variables:

- ALGOLIA_APPLICATION_ID: the application id of your algolia account
- ALGOLIA_ADMIN_KEY: the admin key associated
- SPOTIFY_ID: your spotify client id
- SPOTIFY_SECRET: the associated secret to get access to the API

Once that this is setup, follow those steps:

- `cd scrapper`
- `npm install`
- `node index.js`
- `node upload.js`

## Running the UI

Follow those steps:

- `cd web2`
- `npm`
- `npm start`
- open `http://localhost:9000`
