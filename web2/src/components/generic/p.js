import React from "react"
import classnames from "classnames"

const P = ({ className, children, ...otherProps }) => (
  <p className={classnames("leading-relaxed pb-4", className)} {...otherProps}>
    {children}
  </p>
)

export default P
