import { combineReducers } from "redux";

const defaultData = {
  'schools': {},
  'districts': {},
  'counties': {}
}

/**
 * Manages state that tracks all scatterplot data
 * @param {*} state 
 * @param {*} action 
 */
const data = (state = defaultData, action) => {
  switch(action.type) {
    case 'SCATTERPLOT_DATA_RECEIVED':
      return {
        ...state,
        [action.region]: {
          ...state[action.region],
          ...action.data
        }
      }
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

const scatterplot = combineReducers({ data, loaded })

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
    if (data[varName][id]) {
      obj[varName] = data[varName][id]
    }
    return obj;
  }, {})
}