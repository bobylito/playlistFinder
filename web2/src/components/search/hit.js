import React from "react"

const Hit = ({ hit }) => (
  <a href={hit.href} target="_blank" class="poster" rel="noopener noreferrer">
    {hit.images.length > 0 && (
      <div className="hit-image w-full h-full object-cover">
        <img src={hit.images[0].url} alt={hit.images[0].name} />
      </div>
    )}
  </a>
)

export default Hit
