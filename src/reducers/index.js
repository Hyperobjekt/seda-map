import { combineReducers } from 'redux'
import map from '../modules/map/reducer'
import scatterplot from './scatterplot'
import search from './search'
import selected from './selected'
import features from './features'
import sections from './sections'
import ui from './ui'
import tooltip from './tooltip'
import help from './help'
import flagged from './flagged'
import loading from './loading'

const active = (state = null, { type, feature }) => {
  switch (type) {
    case 'SET_ACTIVE_LOCATION':
      return feature
    case 'CLEAR_ACTIVE_LOCATION':
      return null
    default:
      return state
  }
}

export default combineReducers({
  map,
  scatterplot,
  search,
  selected,
  features,
  sections,
  ui,
  active,
  tooltip,
  help,
  flagged,
  loading
})
