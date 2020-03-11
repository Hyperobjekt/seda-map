import { loadFeatureFromCoords } from '../../shared/utils/tilequery'
import { getRegionFromFeatureId } from '../../shared/selectors'

export const setExplorerSecondary = secondaryId => ({
  type: 'SET_EXPLORER_SECONDARY',
  secondaryId
})

/** Returns an action that pins the provided feature */
const addSelectedFeature = (feature, region) => ({
  type: 'ADD_SELECTED_FEATURE',
  feature,
  region
})

/** Returns an action that sets the active location  */
export const setActiveLocation = (feature, source) => ({
  type: 'SET_ACTIVE_LOCATION',
  feature,
  source
})

/**
 * Update the route and dispatch event to update secondary metric
 * @param {string} secondary
 */
export const onSecondaryChange = secondary => dispatch => {
  // updateRoute({ secondary })
  dispatch(setExplorerSecondary(secondary))
}

/**
 * Returns an action to dispatch when a request
 * to load features has been made
 * @param {*} locations
 */
const onLoadFeaturesRequest = locations => ({
  type: 'LOAD_FEATURES_REQUEST',
  locations
})

/**
 * Returns an action to dispatch when features have
 * loaded successfully.
 * @param {*} features
 */
const onLoadFeaturesSuccess = features => ({
  type: 'LOAD_FEATURES_SUCCESS',
  features
})

/**
 * Returns an action to dispatch when there was an
 * error loading features
 */
const onLoadFeaturesError = error => ({
  type: 'LOAD_FEATURES_ERROR',
  error
})

/**
 * Action to dispatch when receiving fetched scatterplot data
 * for a region.
 * @param {object} data
 * @param {string} region
 */
export const onScatterplotData = (data, region) => {
  return {
    type: 'SCATTERPLOT_DATA_RECEIVED',
    region,
    data
  }
}

/**
 * Action to dispatch when receiving fetched scatterplot data
 * for a region.
 * @param {object} data
 * @param {string} region
 */
export const onScatterplotError = (e, sectionId) => {
  return {
    type: 'SCATTERPLOT_ERROR',
    message: e.message || e,
    sectionId
  }
}

/**
 * Action to dispatch when all data vars for a scatterplot are loaded
 * @param {string} scatterplotId
 */
export const onScatterplotLoaded = scatterplotId => ({
  type: 'SCATTERPLOT_LOADED',
  scatterplotId
})

/**
 * Action to dispatch when loading new vars on scatterplot
 * @param {string} scatterplotId
 */
export const onScatterplotUnloaded = scatterplotId => ({
  type: 'SCATTERPLOT_UNLOADED',
  scatterplotId
})

/** THUNKS */

/**
 * Thunk that loads a provided location and updates route
 * @param {object} location object with id,lat,lon
 *  e.g. { id: 120156001683, lat: 27.83, lon: -82.61 }
 */
export const loadLocation = (location, source) => dispatch => {
  dispatch(onLoadFeaturesRequest([location]))
  return loadFeatureFromCoords(location)
    .then(feature => {
      dispatch(onLoadFeaturesSuccess([feature]))
      dispatch(handleLocationActivation(feature, source))
    })
    .catch(error => {
      dispatch(onLoadFeaturesError(error))
      window.SEDA.trackProblem(
        `error loading location from ${source}: ${location}`
      )
    })
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
 * Thunk that adds a selected feature to the collection and
 * activates the location.
 */
export const handleLocationActivation = (feature, source) => (
  dispatch,
  getState
) => {
  dispatch(
    addSelectedFeature(feature, getRegionFromFeatureId(feature.properties.id))
  )
  dispatch(setActiveLocation(feature, source))
}
