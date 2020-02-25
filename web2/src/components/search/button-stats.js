import React from "react"
import { connectStats } from "react-instantsearch-dom"

import Button from "../generic/button"

const ButtonStats = ({ nbHits, children, ...otherProps }) => (
  <Button {...otherProps}>
    {children}
    <span className="pl-2 font-light">{nbHits}</span>
  </Button>
)

const ConnectedButtonStats = connectStats(ButtonStats)

export default ConnectedButtonStats
