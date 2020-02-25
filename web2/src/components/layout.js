import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import ExternalLink from "./generic/external-link"

import "../style/index.css"

const Layout = ({ location, children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  console.log("location", location)
  return (
    <>
      <Header location={location} siteTitle={data.site.siteMetadata.title} />
      <div>
        <main>{children}</main>
        <footer className="py-10 bg-gray-900 text-gray-300 text-center">
          <p>
            Powered by{" "}
            <ExternalLink href="https://www.algolia.com">Algolia</ExternalLink>{" "}
            - Data from{" "}
            <ExternalLink href="https://developer.spotify.com/web-api/">
              Spotify
            </ExternalLink>{" "}
            - Sources on{" "}
            <ExternalLink href="https://github.com/bobylito/playlistFinder">
              Github
            </ExternalLink>
          </p>
          <p className="pt-5">
            Made by{" "}
            <ExternalLink href="https://www.linkedin.com/in/astanislawski/">
              Alexandre Valsamou-Stanislawski
            </ExternalLink>{" "}
            /{" "}
            <ExternalLink href="https://twitter.com/bobylito">
              @bobylito
            </ExternalLink>
          </p>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
