import React from 'react'
import PropTypes from 'prop-types'
import {
  connectAutoComplete,
  InstantSearch,
  Index,
  Configure
} from 'react-instantsearch-dom'
import AutoComplete from './AutoComplete'
import { useSearchClient } from '../hooks/useSearchClient'

const ConnectedAutoComplete = connectAutoComplete(AutoComplete)

const AlgoliaSearch = ({
  algoliaId,
  algoliaKey,
  indices,
  ...props
}) => {
  const searchClient = useSearchClient(algoliaId, algoliaKey)
  return indices.length && searchClient ? (
    <InstantSearch
      indexName={indices[0]}
      searchClient={searchClient}>
      <Configure hitsPerPage={5} />
      <ConnectedAutoComplete
        multiSection={indices.length > 1}
        {...props}
      />
      {indices.map((index, i) => (
        <Index key={index + i} indexName={index} />
      ))}
    </InstantSearch>
  ) : (
    <div className="error">
      {indices.length === 0 && `No indices for search.`}
      {!searchClient && `Unable to create search client.`}
    </div>
  )
}

AlgoliaSearch.defaultProps = {
  indicies: []
}

AlgoliaSearch.propTypes = {
  /** algolia search id */
  algoliaId: PropTypes.string,
  /** algolia search key */
  algoliaKey: PropTypes.string,
  /** algolia indicies to search */
  indicies: PropTypes.array
}

export default AlgoliaSearch
