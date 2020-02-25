import React from "react"
import Layout from "../components/layout"
import Search from "../components/search/index"
import SEO from "../components/seo"

const IndexPage = ({ location }) => {
  return (
    <Layout location={location}>
      <SEO title="Home" />
      <Search />
    </Layout>
  )
}

export default IndexPage
