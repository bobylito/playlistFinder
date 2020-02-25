import React from "react"
import classnames from "classnames"

export default ({ children, className, ...otherProps }) => (
  <a {...otherProps} className={classnames("text-accent", className)}>
    {children}
  </a>
)
