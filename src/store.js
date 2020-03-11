import { createStore, applyMiddleware, compose } from 'redux'
import {
  connectRouter,
  routerMiddleware
} from 'connected-react-router'
import thunk from 'redux-thunk'
import * as History from 'history'
import { createMiddleware } from 'redux-beacon'
import GoogleTagManager from '@redux-beacon/google-tag-manager'
import { getRegionFromFeature } from './shared/selectors'
import { getLang } from './shared/selectors/lang'
import rootReducer from './reducers'

const createHistory = History.createHashHistory

const localStorageMiddleware = store => next => action => {
  const state = store.getState()
  // only apply middleware if it's a non-embed route
  if (
    window.supportsLocalStorage &&
    state.router &&
    state.router.location &&
    state.router.location.pathname &&
    state.router.location.pathname.indexOf('embed') === -1
  ) {
    if (action.type === 'SET_EXPLORER_REGION') {
      if (localStorage.getItem('region') !== action.regionId) {
        localStorage.setItem('region', action.regionId)
      }
    }
    if (action.type === 'SET_EXPLORER_VIEW') {
      if (localStorage.getItem('view') !== action.view) {
        localStorage.setItem('view', action.view)
      }
    }
    if (action.type === 'SET_EXPLORER_METRIC') {
      if (localStorage.getItem('metric') !== action.metricId) {
        localStorage.setItem('metric', action.metricId)
      }
    }
    if (action.type === 'SET_EXPLORER_DEMOGRAPHIC') {
      if (
        localStorage.getItem('demographic') !==
        action.demographicId
      ) {
        localStorage.setItem('demographic', action.demographicId)
      }
    }
  }
  return next(action)
}

const eventsMap = {
  SET_EXPLORER_METRIC: action => ({
    event: 'metricSelected',
    metricSelection: getLang('LABEL_' + action.metricId)
  }),
  SET_EXPLORER_DEMOGRAPHIC: action => ({
    event: 'studentTypeSelected',
    studentTypeSelection: getLang(
      'LABEL_' + action.demographicId
    )
  }),
  SET_EXPLORER_REGION: action => ({
    event: 'geoTypeSelected',
    geoTypeSelection: action.regionId
  }),
  SET_EXPLORER_STATE: action => ({
    event: 'geoSelected',
    geoSelection: action.stateId
  }),
  SET_EXPLORER_VIEW: action => ({
    event: 'displayTypeSelected',
    displayTypeSelection: action.view
  }),
  SEARCH_HIT_SELECTED: action => ({
    event: 'searchSelected',
    searchSelection:
      action.hit.name + ', ' + action.hit.state_name
  }),
  MAP_LEGEND_ACTION: action => ({
    event: 'chartButtonSelected',
    chartButtonSelection: action.itemId
  }),
  SHOW_HELP_TOPIC: action => {
    return {
      event: 'helpTopicExpanded',
      helpTopicExpansion: getLang(action.topicId)
    }
  },
  SHOW_SINGLE_TOPIC: action => {
    return {
      event: 'helpTopicExpanded',
      helpTopicExpansion: getLang(action.topicId)
    }
  },
  REPORT_DOWNLOAD_REQUEST: action => ({
    event: 'reportDownloaded',
    geoTypeSelected: getRegionFromFeature(action.feature),
    locationId: action.feature.properties.id,
    locationName: action.feature.properties.name
  }),
  SOCIAL_SHARE: action => ({
    event: 'shareType',
    shareType: action.shareType,
    shareUrl: action.url
  }),
  SET_ACTIVE_LOCATION: action => ({
    event: 'locationSelected',
    locationId: action.feature.properties.id,
    locationName: action.feature.properties.name,
    selectionSource: action.source
  }),
  SHOW_SIMILAR: action => ({
    event: 'similarPlacesComparison',
    geoTypeSelected: getRegionFromFeature(action.feature),
    locationId: action.feature.properties.id,
    locationName: action.feature.properties.name
  }),
  SET_GAP_CHART_VISIBILITY: action => {
    if (action.visible) {
      return {
        event: 'gapViewActivated',
        studentTypeSelection: getLang(
          'LABEL_' + action.demographicId
        )
      }
    }
  }
}

const gtm = GoogleTagManager()

const gtmMiddleware = createMiddleware(eventsMap, gtm)

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  routerMiddleware(history),
  gtmMiddleware,
  localStorageMiddleware
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

export default createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composedEnhancers
)
