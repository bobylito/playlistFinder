import React from "react"
import classnames from "classnames"

const H1 = ({ className, children, ...otherProps }) => (
  <h1
    className={classnames(
      "text-blue-800 font-semibold tracking-wide pb-2 text-2xl",
      className
    )}
    {...otherProps}
  >
    {children}
  </h1>
)

export default H1
