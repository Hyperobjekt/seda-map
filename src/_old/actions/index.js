import {
  loadFeaturesFromRoute,
  loadFeatureFromCoords,
  loadFlaggedData
} from '../shared/utils/tilequery'
import {
  getFeatureProperty,
  getRegionFromLocationId,
  getRegionFromFeature,
  getPredictedValue
} from '../shared/selectors'
import { FlyToInterpolator } from 'react-map-gl'
import * as ease from 'd3-ease'
import {
  addFeatureToRoute,
  removeFeatureFromRoute,
  updateRoute
} from '../modules/router'
import {
  getStateViewport,
  getStateName
} from '../shared/selectors/states'
import axios from 'axios'
import { formatNumber } from '../shared/utils'

/** ACTIONS */

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

const onLoadFlaggedRequest = () => ({
  type: 'LOAD_FLAGGED_REQUEST'
})

const onLoadFlaggedSuccess = (flag, ids) => ({
  type: 'LOAD_FLAGGED_SUCCESS',
  flag,
  ids
})

const onLoadFlaggedError = error => ({
  type: 'LOAD_FLAGGED_ERROR',
  error
})

export const onLoadMapSuccess = () => ({
  type: 'LOAD_MAP_SUCCESS'
})

export const onLoadScatterplotSuccess = () => ({
  type: 'LOAD_SCATTERPLOT_SUCCESS'
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

/** Returns an action that clears the active location  */
export const clearActiveLocation = () => ({
  type: 'CLEAR_ACTIVE_LOCATION'
})

/**
 * Returns an action to set the viewport to match the size
 * of the element matching the provided provided class name
 * @param {*} className class of element to match dimensions for (default 'map')
 */
export const updateMapSize = (className = 'map') => {
  const el = document.getElementsByClassName(className)[0]
  const size = el
    ? { width: el.clientWidth, height: el.clientHeight }
    : { width: 400, height: 400 }
  return onViewportChange(size)
}

/**
 * Returns an action to map school ids
 * in the feature properties to the feature ids
 * @param {*} features
 */
export const addToFeatureIdMap = features => ({
  type: 'ADD_TO_FEATURE_ID_MAP',
  features
})

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

/** Sets the section the user is currently interacting with */
export const onHoverSection = sectionId => {
  return {
    type: 'SET_ACTIVE_SECTION',
    sectionId
  }
}

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

export const toggleGapChart = (visible, demographicId) => ({
  type: 'SET_GAP_CHART_VISIBILITY',
  visible,
  demographicId
})

export const showHelpTopic = topicId => ({
  type: 'SHOW_HELP_TOPIC',
  topicId
})

export const hideHelpTopic = topicId => ({
  type: 'HIDE_HELP_TOPIC',
  topicId
})

export const showSingleHelpTopic = topicId => ({
  type: 'SHOW_SINGLE_TOPIC',
  topicId
})

export const setExplorerMetric = metricId => ({
  type: 'SET_EXPLORER_METRIC',
  metricId
})

export const setExplorerDemographic = demographicId => ({
  type: 'SET_EXPLORER_DEMOGRAPHIC',
  demographicId
})

export const setExplorerRegion = regionId => ({
  type: 'SET_EXPLORER_REGION',
  regionId
})

export const setExplorerState = stateId => ({
  type: 'SET_EXPLORER_STATE',
  stateId
})

export const setExplorerView = view => ({
  type: 'SET_EXPLORER_VIEW',
  view
})

export const setExplorerSecondary = secondaryId => ({
  type: 'SET_EXPLORER_SECONDARY',
  secondaryId
})

export const setExplorerLocations = locations => ({
  type: 'SET_EXPLORER_LOCATIONS',
  locations
})

export const onSearchSelection = hit => ({
  type: 'SEARCH_HIT_SELECTED',
  hit
})

export const onMapLegendAction = itemId => ({
  type: 'MAP_LEGEND_ACTION',
  itemId
})

export const onShowSimilarAction = feature => {
  return {
    type: 'SHOW_SIMILAR',
    feature
  }
}

export const toggleEmbedDialog = open => ({
  type: 'SET_EMBED_DIALOG',
  open
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
 * Thunk that loads locations from the route pathname
 * @param {*} locations contains comma separated id,lat,lon,
 *  with multuple locations concatenated with a '+'.
 *  e.g. "12019,28.89,-81.17+12015,27.83,-82.61"
 */
export const loadRouteLocations = (
  locations,
  region
) => dispatch => {
  dispatch(onLoadFeaturesRequest(locations))
  return loadFeaturesFromRoute(locations)
    .then(features => {
      let activeFeature = false
      dispatch(onLoadFeaturesSuccess(features))
      dispatch(addToFeatureIdMap(features))
      features.forEach(f => {
        const featureRegion = getRegionFromLocationId(
          f.properties.id
        )
        dispatch(addSelectedFeature(f, featureRegion))
        if (!activeFeature && featureRegion === region) {
          dispatch(setActiveLocation(f, 'url'))
          activeFeature = true
        }
      })
    })
    .catch(error => {
      dispatch(onLoadFeaturesError(error))
      window.SEDA.trackProblem(
        'error loading locations from route'
      )
    })
}

/**
 * Thunk that loads flagged schools
 */
export const loadFlaggedSchools = () => dispatch => {
  dispatch(onLoadFlaggedRequest())
  return Promise.all(
    ['sped', 'lep', 'gifted'].map(type => {
      return loadFlaggedData(type)
        .then(res => {
          dispatch(onLoadFlaggedSuccess(type, res.data))
        })
        .catch(error => {
          dispatch(onLoadFlaggedError(error))
          window.SEDA.trackProblem(
            'error loading flagged schools'
          )
        })
    })
  )
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
 * Update the route and dispatch the event to update metric
 */
export const onMetricChange = metric => dispatch => {
  updateRoute({ metric })
  dispatch(setExplorerMetric(metric))
}

/**
 * Update the route and dispatch event to update secondary metric
 * @param {string} secondary
 */
export const onSecondaryChange = secondary => dispatch => {
  updateRoute({ secondary })
  dispatch(setExplorerSecondary(secondary))
}

/**
 * Update the route and dispatch the event to update metric
 */
export const onViewChange = view => dispatch => {
  updateRoute({ view })
  dispatch(setExplorerView(view))
}

export const onDemographicChange = demographic => dispatch => {
  updateRoute({ demographic })
  dispatch(setExplorerDemographic(demographic))
}

export const setDemographicAndMetric = (
  demographic,
  metric
) => dispatch => {
  updateRoute({ demographic, metric })
  dispatch(setExplorerDemographic(demographic))
  dispatch(setExplorerMetric(metric))
}

export const onHighlightedStateChange = stateAbbr => dispatch => {
  updateRoute({ highlightedState: stateAbbr })
  dispatch(setExplorerState(stateAbbr))
  dispatch(navigateToStateByAbbr(stateAbbr))
}

export const onRouteUpdates = (updates = {}) => dispatch => {
  if (updates.hasOwnProperty('region')) {
    dispatch(setExplorerRegion(updates.region))
  }
  if (updates.hasOwnProperty('highlightedState')) {
    dispatch(setExplorerState(updates.highlightedState))
  }
  if (updates.hasOwnProperty('demographic')) {
    dispatch(setExplorerDemographic(updates.demographic))
  }
  if (updates.hasOwnProperty('metric')) {
    dispatch(setExplorerMetric(updates.metric))
  }
  if (updates.hasOwnProperty('secondary')) {
    dispatch(setExplorerSecondary(updates.secondary))
  }
  if (updates.hasOwnProperty('locations')) {
    dispatch(setExplorerLocations(updates.locations))
  }
  updateRoute(updates)
}

/**
 * Thunk that updates the region in the route
 * @param {*} region
 */
export const onRegionChange = region => (dispatch, getState) => {
  const routeUpdates = { region }
  // set demographic to 'all' if switching to schools
  if (region === 'schools') {
    routeUpdates['demographic'] = 'all'
    routeUpdates['secondary'] = 'frl'
  } else {
    const secondary = getState()['sections']['gapChartX']
    routeUpdates['secondary'] = secondary
  }
  updateRoute(routeUpdates)
  dispatch(setExplorerRegion(region))
  dispatch(clearActiveLocation())
}

/**
 * Thunk that adds a feature to the selected list
 * and updates the route
 * @param {object} feature
 * @param {string} region e.g. "counties"
 */
export const onPinFeature = (feature, region) => (
  dispatch,
  getState
) => {
  dispatch(addSelectedFeature(feature, region))
  addFeatureToRoute(
    dispatch,
    getState().router.location.pathname,
    feature
  )
}

/**
 * Thunk that dispatches remove action and
 * removes the feature from the route.
 * @param {object} feature
 */
export const onRemoveSelectedFeature = feature => (
  dispatch,
  getState
) => {
  const { active } = getState()
  if (
    getFeatureProperty(feature, 'id') ===
    getFeatureProperty(active, 'id')
  ) {
    dispatch(clearActiveLocation())
  }
  dispatch({
    type: 'REMOVE_SELECTED_FEATURE',
    feature
  })
  removeFeatureFromRoute(
    dispatch,
    getState().router.location.pathname,
    feature
  )
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
      getRegionFromLocationId(feature.properties.id)
    )
  )
  dispatch(setActiveLocation(feature, source))
  const pathname = getState().router.location.pathname
  addFeatureToRoute(dispatch, pathname, feature)
}

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

const getPdfRegion = region => {
  return region === 'counties'
    ? 'county'
    : region === 'districts'
    ? 'district'
    : 'school'
}

export const onReportDownload = feature => dispatch => {
  dispatch({
    type: 'REPORT_DOWNLOAD_REQUEST',
    feature
  })
  const startTimeReport = new Date()

  const featureId = getFeatureProperty(feature, 'id')
  const reportTimeout = setTimeout(() => {
    window.SEDA.trackProblem(
      'report generation longer than 45 seconds: ' + featureId
    )
  }, 45000)
  const region = getRegionFromFeature(feature)
  const avgValue = getFeatureProperty(feature, 'all_avg')
  const grdValue = getFeatureProperty(feature, 'all_grd')
  const cohValue = getFeatureProperty(feature, 'all_coh')
  const sesValue =
    region === 'schools'
      ? getFeatureProperty(feature, 'all_frl')
      : getFeatureProperty(feature, 'all_ses')
  const diffAvg =
    (avgValue || avgValue === 0) && (sesValue || sesValue === 0)
      ? formatNumber(
          avgValue - getPredictedValue(sesValue, 'avg', region)
        )
      : null
  const diffGrd =
    (grdValue || grdValue === 0) && (sesValue || sesValue === 0)
      ? (grdValue - getPredictedValue(sesValue, 'grd', region)) *
        100
      : null
  const diffCoh =
    (cohValue || cohValue === 0) && (sesValue || sesValue === 0)
      ? formatNumber(
          cohValue - getPredictedValue(sesValue, 'coh', region)
        )
      : null
  axios({
    url: 'https://export.edopportunity.org/',
    method: 'POST',
    data: {
      region: getPdfRegion(region),
      location: {
        ...feature.properties,
        state_name: getStateName(feature.properties.id),
        diff_avg: diffAvg,
        diff_grd: diffGrd,
        diff_coh: diffCoh
      },
      url: window.location.href,
      others: null
    },
    responseType: 'blob' // important
  })
    .then(response => {
      dispatch({
        type: 'REPORT_DOWNLOAD_SUCCESS',
        feature
      })
      clearTimeout(reportTimeout)
      const endTimeReport = new Date()
      const reportTime = parseInt(
        endTimeReport - startTimeReport
      )
      window.SEDA.trackTiming(
        'load',
        'pdf generated',
        reportTime
      )
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        feature.properties.name + '.pdf'
      )
      document.body.appendChild(link)
      link.click()
    })
    .catch(error => {
      dispatch({
        type: 'REPORT_DOWNLOAD_FAILED',
        error
      })
      window.SEDA.trackProblem(
        'error generating PDF for ' + featureId
      )
    })
}
