import React from "react"
import classnames from "classnames"

const Button = ({ children, className, ...otherProps }) => (
  <button
    className={classnames(
      "block mx-auto mb-3 px-5 py-2 bg-accent text-white rounded-lg font-semibold tracking-wider focus:outline-none hover:shadow-outline hover:rounded-lg focus:shadow-outline focus:rounded-lg",
      className
    )}
    {...otherProps}
  >
    {children}
  </button>
)

export default Button
