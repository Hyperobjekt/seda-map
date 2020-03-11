import { combineReducers } from "redux";

const initialState = {
  results: {},
  errorMessage: null
}

const errorMessage = (state = null, action) => {
  switch(action.type) {
    case 'FETCH_PLACE_REQUEST':
    case 'FETCH_PLACE_SUCCESS':
      return null
    case 'FETCH_PLACE_ERROR':
      return action.errorMessage
    default:
      return state;
  }
}

const results = (state = initialState, action) => {
  switch(action.type) {
    case 'FETCH_PLACE_SUCCESS':
      return {
        ...state, 
        ...action.results 
      }
    default:
      return state;
  }
}

const search = combineReducers({results, errorMessage});

export default search;