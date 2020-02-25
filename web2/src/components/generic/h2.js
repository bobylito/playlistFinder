import React from "react"
import classnames from "classnames"

const H2 = ({ className, children, ...otherProps }) => (
  <h2
    className={classnames(
      "text-blue-800 font-semibold tracking-wide pb-2",
      className
    )}
    {...otherProps}
  >
    {children}
  </h2>
)

export default H2
