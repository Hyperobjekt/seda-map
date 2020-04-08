import React from 'react'
import PropTypes from 'prop-types'
import AlgoliaSearch from '../../search'
import { useAddLocationsByRoute, useFlyToLatLon } from '../hooks'

const getPropFromHit = (hit = {}, propName) => {
  if (!hit.suggestion || !hit.suggestion[propName]) return null
  return hit.suggestion[propName]
}

const SedaSearch = ({
  indices,
  inputProps,
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
      {...props}
    />
  )
}

SedaSearch.defaultProps = {
  inputProps: {},
  placeholder: 'search',
  indices: ['cities', 'counties', 'districts', 'schools']
}

SedaSearch.propTypes = {
  indices: PropTypes.array,
  inputProps: PropTypes.object
}

export default SedaSearch

// import {
//   onViewportChange,
//   loadLocation,
//   onRouteUpdates,
//   onSearchSelection
// } from '../../actions'
// import { getRegionFromFeatureId } from '../../shared/selectors'
// import Search from '../molecules/Search'
// import { getStateAbbrFromName } from '../../shared/selectors/states'

// const mapDispatchToProps = dispatch => ({
//   onSuggestionSelected: hit => {
//     const region = getRegionFromFeatureId(hit.id) || 'schools'
//     const state = getStateAbbrFromName(hit.state_name)
//     const routeUpdates = {}
//     if (hit) {
//       dispatch(
//         onViewportChange({
//           latitude: parseFloat(hit.lat),
//           longitude: parseFloat(hit.lon),
//           zoom: hit.id ? hit.id.length + 3.5 : 12,
//           transitionDuration: 3000,
//           transitionInterpolator: new FlyToInterpolator(),
//           transitionEasing: ease.easeCubic
//         })
//       )
//       if (region) {
//         routeUpdates['region'] = region
//       }
//       // switch demographic to all if schools
//       if (region === 'schools') {
//         routeUpdates['demographic'] = 'all'
//         routeUpdates['secondary'] = 'frl'
//       } else {
//         routeUpdates['secondary'] = 'ses'
//       }
//       if (state) {
//         routeUpdates['highlightedState'] = state.toLowerCase()
//       }
//       if (hit.id) {
//         dispatch(
//           loadLocation(
//             {
//               id: hit.id,
//               lat: hit.lat,
//               lon: hit.lon
//             },
//             'search'
//           )
//         )
//       }
//       dispatch(onSearchSelection(hit))
//       dispatch(onRouteUpdates(routeUpdates))
//     }
//   }
// })

// export default compose(
//   withRouter,
//   connect(
//     null,
//     mapDispatchToProps
//   )
// )(Search)
