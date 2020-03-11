import { combineReducers } from 'redux'

/**
 * Reducer to track hovered feature
 */
const hovered = (state = null, action) => {
  switch (action.type) {
    case 'SET_HOVERED_FEATURE':
      return action.feature || null
    default:
      return state
  }
}

/**
 * Reducer to track active section
 * @param {*} state
 * @param {*} action
 */
const active = (state = 'map', action) => {
  switch (action.type) {
    case 'SET_ACTIVE_SECTION':
      return state !== action.sectionId ? action.sectionId : state
    default:
      return state
  }
}

const gapChart = (state = true, action) => {
  switch (action.type) {
    case 'SET_GAP_CHART_VISIBILITY':
      return action.visible
    default:
      return state
  }
}

const gapChartX = (state = 'ses', action) => {
  switch (action.type) {
    case 'SET_EXPLORER_SECONDARY':
      return action.secondaryId
    default:
      return state
  }
}

export default combineReducers({
  hovered,
  active,
  gapChart,
  gapChartX
})
