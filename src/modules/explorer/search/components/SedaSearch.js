import React from 'react'
import PropTypes from 'prop-types'
import AlgoliaSearch from '../../../search'
import useActivateSearchHit from '../hooks/useActivateSearchHit'
import useFlyToSearchHit from '../hooks/useFlyToSearchHit'

/**
 * A base search component for searching SEDA data in Algolia
 */
const SedaSearch = ({
  indices,
  inputProps,
  TextFieldProps,
  placeholder,
  activateSelection,
  flyToSelection,
  onSelect,
  onClear,
  ...props
}) => {
  const activateHit = useActivateSearchHit()
  const flyToHit = useFlyToSearchHit()

  const handleSelected = (e, hit) => {
    activateSelection && activateHit(hit)
    flyToSelection && flyToHit(hit)
    onSelect && onSelect(e, hit)
  }

  const handleCleared = (...args) => {
    onClear && onClear(args)
  }

  return (
    <AlgoliaSearch
      algoliaId={process.env.REACT_APP_ALGOLIA_ID}
      algoliaKey={process.env.REACT_APP_ALGOLIA_KEY}
      onSuggestionSelected={handleSelected}
      onSelectedClear={handleCleared}
      indices={indices}
      inputProps={{ ...inputProps, placeholder, "aria-label": "search" }}
      TextFieldProps={TextFieldProps}
      {...props}
    />
  )
}

SedaSearch.defaultProps = {
  inputProps: {},
  placeholder: 'search',
  activateSelection: true,
  flyToSelection: true,
  indices: [
    'states',
    'cities',
    'counties',
    'districts',
    'schools'
  ]
}

SedaSearch.propTypes = {
  /** The algolia indicies to use for search */
  indices: PropTypes.array,
  /** Props that get passed to the <input> component */
  inputProps: PropTypes.object,
  /** Props that get passed to the <TextField> component */
  TextFieldProps: PropTypes.object,
  /** Placeholder text for the component */
  placeholder: PropTypes.string,
  /** Boolean determining if the location's panel should be activated on selection  */
  activateSelection: PropTypes.bool,
  /** Boolean determining if the map should zoom to the selection */
  flyToSelection: PropTypes.bool,
  /** Callback for when a search items is selected */
  onSelect: PropTypes.func,
  /** Callback for when the current term is cleared */
  onClear: PropTypes.func
}

export default SedaSearch
