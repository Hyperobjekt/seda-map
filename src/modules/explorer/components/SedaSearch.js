import React from 'react'
import PropTypes from 'prop-types'
import AlgoliaSearch from '../../search'
import { useFlyToLatLon } from '../../map'
import { useAddLocationsByRoute } from '../hooks'

const getPropFromHit = (hit = {}, propName) => {
  if (!hit.suggestion || !hit.suggestion[propName]) return null
  return hit.suggestion[propName]
}

const SedaSearch = ({
  indices,
  inputProps,
  TextFieldProps,
  placeholder,
  ...props
}) => {
  const addLocationByRoute = useAddLocationsByRoute()
  const flyToLatLon = useFlyToLatLon()

  const handleSelected = (event, hit) => {
    const id = getPropFromHit(hit, 'id')
    const lat = getPropFromHit(hit, 'lat')
    const lon = getPropFromHit(hit, 'lon')
    // no locaton id, assume hit is a city
    if (!id) return lat && lon && flyToLatLon(lat, lon, 12)
    // location id is present, grab lat and lon from hit
    const locationRoute = [id, lat, lon].join(',')
    locationRoute && addLocationByRoute(locationRoute)
  }

  const handleCleared = (...args) => {
    console.log('cleared', args)
  }

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

SedaSearch.defaultProps = {
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

SedaSearch.propTypes = {
  indices: PropTypes.array,
  inputProps: PropTypes.object
}

export default SedaSearch
