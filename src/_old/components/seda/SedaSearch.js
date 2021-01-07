import { connect } from 'react-redux'
import { FlyToInterpolator } from 'react-map-gl'
import * as ease from 'd3-ease'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import {
  onViewportChange,
  loadLocation,
  onRouteUpdates,
  onSearchSelection
} from '../../actions'
import { getRegionFromLocationId } from '../../shared/selectors'
import Search from '../molecules/Search'
import { getStateAbbrFromName } from '../../shared/selectors/states'

const mapDispatchToProps = dispatch => ({
  onSuggestionSelected: hit => {
    const region = getRegionFromLocationId(hit.id) || 'schools'
    const state = getStateAbbrFromName(hit.state_name)
    const routeUpdates = {}
    if (hit) {
      dispatch(
        onViewportChange({
          latitude: parseFloat(hit.lat),
          longitude: parseFloat(hit.lon),
          zoom: hit.id ? hit.id.length + 3.5 : 12,
          transitionDuration: 3000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: ease.easeCubic
        })
      )
      if (region) {
        routeUpdates['region'] = region
      }
      // switch demographic to all if schools
      if (region === 'schools') {
        routeUpdates['demographic'] = 'all'
        routeUpdates['secondary'] = 'frl'
      } else {
        routeUpdates['secondary'] = 'ses'
      }
      if (state) {
        routeUpdates['highlightedState'] = state.toLowerCase()
      }
      if (hit.id) {
        dispatch(
          loadLocation(
            {
              id: hit.id,
              lat: hit.lat,
              lon: hit.lon
            },
            'search'
          )
        )
      }
      dispatch(onSearchSelection(hit))
      dispatch(onRouteUpdates(routeUpdates))
    }
  }
})

export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(Search)
