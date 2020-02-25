import classnames from "classnames"
import { graphql, Link, useStaticQuery } from "gatsby"
import MenuIcon from "@material-ui/icons/Menu"
import PropTypes from "prop-types"
import React, { useState } from "react"

const MenuItem = ({ to, children, className, location, ...otherProps }) => (
  <li
    className={classnames("px-3 py-1", className, {
      "text-accent": location.pathname === to,
    })}
    {...otherProps}
  >
    <Link to={to}>{children}</Link>
  </li>
)

const Header = ({ siteTitle, location = {} }) => {
  const [displayMenu, setDisplayMenu] = useState(false)
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
    <header className="bg-white mb-3">
      <div className=" my-auto shadow-md flex justify-between items-center relative">
        <h1 className="m-0 py-1 grow px-1">
          <Link
            to="/"
            className="text-black text-xl flex items-center font-display"
          >
            <img src={logoURL} width={40} className="" alt="" />
            <span className="h-full pt-1">{siteTitle}</span>
          </Link>
        </h1>
        <ul className="md:flex text-lg hidden">
          <MenuItem to="/" location={location}>
            Search
          </MenuItem>
          <MenuItem to="/statistics" className="pl-3" location={location}>
            Data set
          </MenuItem>
          <MenuItem to="/about" className="pl-3 pr-2" location={location}>
            About
          </MenuItem>
        </ul>
        <button
          className="mx-1 px-1 md:hidden"
          onClick={() => {
            setDisplayMenu(!displayMenu)
          }}
        >
          <MenuIcon />
        </button>
        {displayMenu && (
          <ul className="flex flex-col text-lg absolute w-full top-100 text-right bg-white z-10 shadow-md">
            <MenuItem to="/" location={location}>
              Search
            </MenuItem>
            <MenuItem to="/statistics" className="pl-3" location={location}>
              Data set
            </MenuItem>
            <MenuItem to="/about" className="pl-3 pr-2" location={location}>
              About
            </MenuItem>
          </ul>
        )}
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
