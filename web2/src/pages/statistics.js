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
  // const {
  //   allMongodbPlaylistFinderPlaylists: { group: playlistsByCurator },
  // } = useStaticQuery(graphql`
  //   query {
  //     allMongodbPlaylistFinderPlaylists {
  //       group(field: owner) {
  //         totalCount
  //         fieldValue
  //       }
  //     }
  //   }
  // `)

  // const {
  //   allMongodbPlaylistFinderPlaylists: { totalCount: totalPlaylists },
  // } = useStaticQuery(graphql`
  //   query {
  //     allMongodbPlaylistFinderPlaylists {
  //       totalCount
  //     }
  //   }
  // `)

  return (
    <Layout location={location}>
      <SEO title="About playlist detective" />
      <div className="pb-12 pt-6 ">
        <img src={logoURL} className="w-1/2 m-auto max-w-xs" alt="" />
      </div>
      <div className="px-2 max-w-3xl mx-auto">
        <H1>Some data about the playlists</H1>
        <P>Coming soon!</P>
      </div>
    </Layout>
  )
}

export default AboutPage
