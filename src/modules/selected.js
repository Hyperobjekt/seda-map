import { combineReducers } from "redux";

const idLengths = {
  'counties': 5,
  'districts': 7,
  'schools': 12
}

const selectedColors = [
  '#ff0d00', 
  '#cc4f14', 
  '#ff9233', 
  '#e5a800', 
  '#fbff00', 
  '#32e617', 
  '#3dcc82', 
  '#00e2e6', 
  '#2967cc', 
  '#171ae6', 
  '#a329cc', 
  '#e6179a', 
  '#ff3369'
].reverse();

/** Stores a list of feature IDs by region */
const createRegionListReducer = (region) => 
  (state = [], action) => {
    switch (action.type) {
      case 'ADD_SELECTED_FEATURE':
        return (action.region === region || region === 'all') &&
          state.indexOf(action.feature.properties.id) === -1 ? 
          [ ...state, action.feature.properties.id ] : state;
      case 'LOAD_FEATURES_SUCCESS':
        return [
          ...state,
          ...action.features
            .filter(f =>
              region === 'all' ||
              f.properties.id.length === idLengths[region]
            )
            .map(f => f.properties.id)
        ]
      case 'REMOVE_SELECTED_FEATURE':
        return (
          action.feature.properties.id.length === idLengths[region] || 
          region === 'all'
        ) ? 
          state.filter(id => 
            id !== action.feature.properties.id
          ) : state;
      default:
        return state;
    }
  }

const colors = (state = selectedColors) => state

const listReducers = ['all', 'counties', 'districts', 'schools']
  .reduce((acc, curr) => {
    acc[curr] = createRegionListReducer(curr);
    return acc;
  }, {})

export default combineReducers({
  ...listReducers,
  colors
})
