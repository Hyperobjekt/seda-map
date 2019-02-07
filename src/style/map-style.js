import { fromJS } from 'immutable';
import MAP_STYLE from './style.json';

export const getChoroplethLayer = (region, dataProp) => fromJS({
  id: 'choropleth',
  source: 'composite',
  'source-layer': region,
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: dataProp,
      stops: [
        [ 1, '#d53e4f' ],
        [ 2, '#f46d43' ],
        [ 3, '#fdae61' ],
        [ 4, '#fee08b' ],
        [ 5, '#ffffbf' ],
        [ 6, '#e6f598' ],
        [ 7, '#abdda4' ],
        [ 8, '#66c2a5' ],
        [ 10, '#3288bd' ]
      ]
    },
    'fill-opacity': 0.8
  }
});

export const defaultMapStyle = fromJS(MAP_STYLE);