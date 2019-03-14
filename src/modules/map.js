import { combineReducers } from "redux";

const defaultViewport = {
  latitude: 37.39,
  longitude: -96.78,
  zoom: 3.15
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