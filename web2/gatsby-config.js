module.exports = {
  siteMetadata: {
    title: "Playlist detective",
    description: "Search for your next favorite music using playlists",
    author: "@bobylito",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-27607140-2",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Any additional optional fields
        sampleRate: 5,
        siteSpeedSampleRate: 10,
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Playlist detective - the playlist finder",
        short_name: "Playlist detective",
        start_url: "/",
        background_color: "#fff",
        theme_color: "#FF0579",
        display: "standalone",
        icon: "src/images/logo-demiblack-fat-noBG.svg",
      },
    },
    "gatsby-plugin-offline",
    // {
    //   resolve: `gatsby-source-mongodb`,
    //   options: { dbName: `playlistFinder`, collection: `playlists` },
    // },
  ],
}
