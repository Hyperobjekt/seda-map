import { combineReducers } from "redux";
import * as _merge from 'lodash.merge';

const defaultData = {
  'schools': {},
  'districts': {},
  'counties': {}
}

const handleReceivedData = (state, data, region) => {
  if (region === 'schools') {
    return {
      ...state,
      [region]: _merge({}, state[region], data)
    }
  }
  return {
    ...state,
    [region]: {
      ...state[region],
      ...data
    }
  }
}

/**
 * Manages state that tracks all scatterplot data
 * @param {*} state 
 * @param {*} action 
 */
const data = (state = defaultData, action) => {
  switch(action.type) {
    case 'SCATTERPLOT_DATA_RECEIVED':
      return handleReceivedData(state, action.data, action.region)
    default:
      return state;
  }
}

/**
 * Manages state that tracks loading state for scatterplots
 * @param {*} state 
 * @param {*} action 
 */
const loaded = (state = {}, action) => {
  switch(action.type) {
    case 'SCATTERPLOT_LOADED':
      return {
        ...state,
        [action.scatterplotId]: true
      }
    case 'SCATTERPLOT_UNLOADED':
      return {
        ...state,
        [action.scatterplotId]: false
      }
    default:
      return state;
  }
}

const error = (state = false, action) => {
  switch(action.type) {
    case 'SCATTERPLOT_LOADED':
      return false
    case 'SCATTERPLOT_DATA_RECEIVED':
      return false
    case 'SCATTERPLOT_ERROR':
      return true
    default:
      return state
  }
}

const scatterplot = combineReducers({ data, loaded, error })

export default scatterplot;

/**
 * Gets a variable for a provided region
 * @param {object} state scatterplot state
 * @param {string} region area to grab data for
 * @param {string} prop variable name to retrieve data for
 */
export const getRegionData = ({ data }, region, prop) =>
  data[region] && data[region][prop] ?
    data[region][prop] : null


export const getDataForId = (id, data) => {
  return Object.keys(data).reduce((obj, varName) => {
    if (data[varName][id] || data[varName][id] === 0) {
      obj[varName] = data[varName][id]
    }
    return obj;
  }, {})
}