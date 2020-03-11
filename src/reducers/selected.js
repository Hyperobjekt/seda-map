import { combineReducers } from 'redux'

const MAX_LOCATIONS = 6

const MAP_REGION_TO_ID_LENGTH = {
  counties: 5,
  districts: 7,
  schools: 12
}

/** Stores a list of feature IDs by region */
const createRegionListReducer = region => (
  state = [],
  action
) => {
  switch (action.type) {
    case 'ADD_SELECTED_FEATURE':
      if (
        (action.region === region || region === 'all') &&
        state.indexOf(action.feature.properties.id) === -1
      ) {
        // do not allow more than MAX_LOCATIONS
        return state.length === MAX_LOCATIONS
          ? [...state.slice(1), action.feature.properties.id]
          : [...state, action.feature.properties.id]
      }
      return state
    case 'REMOVE_SELECTED_FEATURE':
      return action.feature.properties.id.length ===
        MAP_REGION_TO_ID_LENGTH[region] || region === 'all'
        ? state.filter(id => id !== action.feature.properties.id)
        : state
    default:
      return state
  }
}

const listReducers = [
  'all',
  'counties',
  'districts',
  'schools'
].reduce((acc, curr) => {
  acc[curr] = createRegionListReducer(curr)
  return acc
}, {})

export default combineReducers({
  ...listReducers
})
