import { combineReducers } from 'redux'
import map from '../components/organisms/Map/reducer';
import scatterplot from './scatterplot';
import search from './search';
import selected from './selected';
import features from './features';
import sections from './sections';
import ui from './ui';


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
})
