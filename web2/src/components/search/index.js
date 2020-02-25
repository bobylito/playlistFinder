import algoliasearch from "algoliasearch/lite"
import classnames from "classnames"
import React, { useState } from "react"
import {
  InfiniteHits,
  InstantSearch,
  PoweredBy,
  RefinementList,
  SearchBox,
  Configure,
} from "react-instantsearch-dom"

import Button from "../generic/button"
import H2 from "../generic/h2"

import ButtonStats from "./button-stats"
import Hit from "./hit"

const indexName = "spotify-search"
const searchClient = algoliasearch(
  "JTH1JDTDFT",
  "25e594bccdc9059ec90ccbe80dcee493"
)

const Search = () => {
  const [displayFilters, setDisplayFilters] = useState(false)
  const [currentPanel, setPanel] = useState("artists") // one of: [artists, songs]
  return (
    <InstantSearch indexName={indexName} searchClient={searchClient}>
      <Configure hitsPerPage={60} />
      <div className="flex mx-2 mb-3 bg-gray-100 rounded-lg shadow">
        <SearchBox
          className="flex-grow"
          showLoadingIndicator
          translations={{ placeholder: "Search for a playlist..." }}
        />
        <PoweredBy
          className="px-2"
          translations={{
            searchBy: "",
          }}
        />
      </div>
      <div className="fixed bottom-0 w-full pb-3 lg:hidden">
        <Button onClick={() => setDisplayFilters(true)}>Filters</Button>
      </div>
      <div
        className={classnames(
          "fixed bottom-0 w-full bg-gray-100 border border-bg-gray-600 pb-3",
          {
            hidden: !displayFilters,
          }
        )}
      >
        <div className="flex justify-around bg-white">
          <button
            className={classnames(
              "w-full text-center py-2 border-b focus:shadow-none focus:bg-accent-100",
              {
                "text-accent": currentPanel === "artists",
                "border-accent": currentPanel === "artists",
              }
            )}
            onClick={() => {
              setPanel("artists")
            }}
          >
            Artists
          </button>
          <button
            className={classnames(
              "w-full text-center py-2 border-b focus:shadow-none focus:bg-accent-100",
              {
                "text-accent": currentPanel === "songs",
                "border-accent": currentPanel === "songs",
              }
            )}
            onClick={() => {
              setPanel("songs")
            }}
          >
            Songs
          </button>
        </div>
        <RefinementList
          attribute="artists"
          searchable
          className={classnames("px-2 pb-3 pt-1", {
            hidden: currentPanel !== "artists",
          })}
          limit={5}
          translations={{
            placeholder: "Search for an artist",
          }}
        />
        <RefinementList
          attribute="songs"
          limit={5}
          searchable
          className={classnames("px-2 pb-3 pt-1", {
            hidden: currentPanel !== "songs",
          })}
          translations={{
            placeholder: "Search for a song",
          }}
        />
        <ButtonStats onClick={() => setDisplayFilters(false)}>
          Show playlists
        </ButtonStats>
      </div>
      <div className="flex">
        <div
          className="hidden lg:inline-block sticky top-0 px-2 w-full"
          style={{ maxWidth: "300px" }}
        >
          <H2>Artists</H2>
          <RefinementList
            attribute="artists"
            searchable
            className="pb-3 pt-1"
            limit={7}
            showMore
            translations={{
              placeholder: "Search for an artist",
            }}
          />
          <H2 className="pt-2">Songs</H2>
          <RefinementList
            attribute="songs"
            limit={7}
            showMore
            searchable
            className="pb-3 pt-1"
            translations={{
              placeholder: "Search for a song",
            }}
          />
        </div>
        <InfiniteHits className="px-2 text-center w-full" hitComponent={Hit} />
      </div>
    </InstantSearch>
  )
}

export default Search
