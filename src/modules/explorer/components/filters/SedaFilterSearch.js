import React from 'react'
import PropTypes from 'prop-types'
import AlgoliaSearch from '../../../search'

const getPropFromHit = (hit = {}, propName) => {
  if (!hit.suggestion || !hit.suggestion[propName]) return null
  return hit.suggestion[propName]
}

const SedaFilterSearch = ({
  indices,
  inputProps,
  TextFieldProps,
  placeholder,
  ...props
}) => {
  const handleSelected = (event, hit) => {}

  const handleCleared = (...args) => {}

  return (
    <AlgoliaSearch
      algoliaId={process.env.REACT_APP_ALGOLIA_ID}
      algoliaKey={process.env.REACT_APP_ALGOLIA_KEY}
      onSuggestionSelected={handleSelected}
      onSelectedClear={handleCleared}
      indices={indices}
      inputProps={{ ...inputProps, placeholder }}
      TextFieldProps={TextFieldProps}
      {...props}
    />
  )
}

SedaFilterSearch.propTypes = {
  /** Placeholder text for input */
  placeholder: PropTypes.string,
  /** Algolia index ID's to search */
  indices: PropTypes.array,
  /** Props for HTML input */
  inputProps: PropTypes.object,
  /** Props for TextField component */
  TextFieldProps: PropTypes.object
}

SedaFilterSearch.defaultProps = {
  inputProps: {},
  placeholder: 'search',
  indices: [
    'states',
    'cities',
    'counties',
    'districts',
    'schools'
  ]
}

SedaFilterSearch.propTypes = {
  indices: PropTypes.array,
  inputProps: PropTypes.object
}

export default SedaFilterSearch
