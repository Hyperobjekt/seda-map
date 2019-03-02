import { combineReducers } from 'redux'
import map from './map';
import scatterplot from './scatterplot';
import search from './search';
import metrics from './metrics';
import hovered from './hovered';
import selected from './selected';
import features from './features';
import reportCard from './reportCard';

export default combineReducers({ 
  map, 
  scatterplot, 
  search,
  metrics,
  hovered,
  selected,
  features,
  reportCard
})
