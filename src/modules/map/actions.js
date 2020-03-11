import { FlyToInterpolator } from 'react-map-gl'
import * as ease from 'd3-ease'
import { addFeatureToRoute, updateRoute } from '../router'
import { getStateViewport } from '../../shared/selectors/states'
import { getRegionFromFeatureId } from '../../shared/selectors'

export const showSingleHelpTopic = topicId => ({
  type: 'SHOW_SINGLE_TOPIC',
  topicId
})

/**
 * Update the route and dispatch the event to update metric
 */
export const onViewChange = view => dispatch => {
  updateRoute({ view })
  dispatch(setExplorerView(view))
}

export const onMapLegendAction = itemId => ({
  type: 'MAP_LEGEND_ACTION',
  itemId
})

export const setExplorerState = stateId => ({
  type: 'SET_EXPLORER_STATE',
  stateId
})

/** Returns an action that sets the active location  */
export const setActiveLocation = (feature, source) => ({
  type: 'SET_ACTIVE_LOCATION',
  feature,
  source
})

export const setExplorerView = view => ({
  type: 'SET_EXPLORER_VIEW',
  view
})

/** Returns an action that pins the provided feature */
const addSelectedFeature = (feature, region) => ({
  type: 'ADD_SELECTED_FEATURE',
  feature,
  region
})

/** Thunk that dispatches the toggle help panel action */
export const toggleHelp = (forceOpen = false) => (
  dispatch,
  getState
) => {
  const state = getState()
  const helpOpen = state.ui.helpOpen
  dispatch({
    type: 'TOGGLE_HELP',
    open: !helpOpen || forceOpen
  })
}

/**
 * Thunk that will navigate to the provided state bounding box
 * @param {string} abbr state abbreviation (e.g. "CA")
 */
export const navigateToStateByAbbr = abbr => (
  dispatch,
  getState
) => {
  const state = getState()
  const vp = getStateViewport(abbr, state.map.viewport)
  return dispatch(onViewportChange(vp, true))
}

/**
 * Returns an action to set the hovered feature for
 * a section.
 */
export const onHoverFeature = (feature, coords, vars = {}) => ({
  type: 'SET_HOVERED_FEATURE',
  feature,
  coords,
  vars
})

/**
 * Returns an action to update the map viewport.
 * @param {object} viewport new viewport to go to
 * @param {boolean} transition true if the viewport should fly to the new viewport
 */
export const onViewportChange = (
  viewport,
  transition = false
) => {
  if (transition) {
    viewport = {
      ...viewport,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: ease.easeCubic
    }
  }
  return {
    type: 'SET_MAP_VIEWPORT',
    viewport
  }
}

/**
 * Thunk that adds a selected feature to the collection and
 * activates the location.
 */
export const handleLocationActivation = (feature, source) => (
  dispatch,
  getState
) => {
  dispatch(
    addSelectedFeature(
      feature,
      getRegionFromFeatureId(feature.properties.id)
    )
  )
  dispatch(setActiveLocation(feature, source))
  const pathname = getState().router.location.pathname
  addFeatureToRoute(dispatch, pathname, feature)
}

export const onHighlightedStateChange = stateAbbr => dispatch => {
  updateRoute({ highlightedState: stateAbbr })
  dispatch(setExplorerState(stateAbbr))
  dispatch(navigateToStateByAbbr(stateAbbr))
}
