import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

import H2 from "../components/generic/h2"
import H1 from "../components/generic/h1"
import P from "../components/generic/p"
import ExternalLink from "../components/generic/external-link"

const AboutPage = ({ location }) => {
  const {
    file: { publicURL: logoURL },
  } = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo-demiblack-fat-noBG.svg" }) {
        publicURL
      }
    }
  `)

  return (
    <Layout location={location}>
      <SEO title="About playlist detective" />
      <div className="pb-12 pt-6 ">
        <img src={logoURL} className="w-1/2 m-auto max-w-xs" alt="" />
      </div>
      <div className="px-2 max-w-3xl mx-auto">
        <H1>About Playlist Detective</H1>
        <H2>What is Playlist Detective</H2>
        <P>
          Playlist Detective is an attempt to ease music discovery with
          playlists. Back in the days, people were sharing mixtapes: some songs
          we knew and others we didn't, therefore expanding our musical
          horizons.
        </P>
        <P>
          Playlists are the same, and playlist detective lets you search for
          songs or artists you like in order to stumble on your new favorite
          songs.
        </P>
        <H2>The search is fast! What is the tech behind?</H2>
        <P>
          Playlist Detective search is{" "}
          <ExternalLink href="https://algolia.com">
            powered by Algolia
          </ExternalLink>
          . Algolia provides the most relevant and fastest search engine out
          there. It is tailored for user facing search.
        </P>
        <P>
          Besides that, the website uses Gatsby which is a next-gen static
          website generator. Data retrieval is done using Node.js and locally
          the data is stored in MongoDB.
        </P>
        <H2>Where do the data come from?</H2>
        <P>
          The data comes from{" "}
          <ExternalLink href="https://developer.spotify.com/documentation/web-api/">
            Spotify web API
          </ExternalLink>
          .
        </P>
        <H2>Who created this project?</H2>
        <P>
          This project has been created and is maintained by{" "}
          <ExternalLink href="https://www.linkedin.com/in/astanislawski/">
            Alexandre Valsamou-Stanislawski
          </ExternalLink>
          . He is an independant contractor from France and he is a former
          Algolia engineer. If you have questions about this project or if you
          are looking for an Algolia contractor,{" "}
          <ExternalLink href="mailto:alex@noima.xyz">reach out!</ExternalLink>
        </P>
      </div>
    </Layout>
  )
}

export default AboutPage
