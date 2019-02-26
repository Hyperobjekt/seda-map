import { combineReducers } from "redux";

const defaultViewport = {
  latitude: 38,
  longitude: -97,
  zoom: 3.5
}
const viewport = (state = defaultViewport, action) => {
  switch (action.type) {
    case 'SET_MAP_VIEWPORT':
      return {
        ...state,
        ...action.viewport
      }
    default:
      return state;
  }
}

const map = combineReducers({ viewport })

export const getChoroplethProperty = (options) => {
  const { metric, demographic } = options;
  return demographic + '_' + metric;
}

export default map;