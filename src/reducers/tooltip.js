import { combineReducers } from "redux";

const xVar = (
  state = 'all_ses', 
  { type, vars }
) => {
  switch(type) {
    case 'SET_HOVERED_FEATURE':
      return vars && vars.xVar && vars.xVar !== state ? 
        vars.xVar : state;
    default:
      return state;
  }
}

const yVar = (
  state = 'all_avg', 
  { type, vars }
) => {
  switch(type) {
    case 'SET_HOVERED_FEATURE':
      return vars && vars.yVar && vars.yVar !== state ? 
        vars.yVar : state;
    default:
      return state;
  }
}

export default combineReducers({
  xVar,
  yVar
})