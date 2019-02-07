import { fromJS } from 'immutable';
import MAP_STYLE from './style.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
  id: 'choropleth',
  source: 'composite',
  'source-layer': 'counties',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'mn_ach',
      stops: [
        [ 5, '#d53e4f' ],
        [ 5, '#f46d43' ],
        [ 7, '#fdae61' ],
        [ 9, '#fee08b' ],
        [ 10, '#ffffbf' ],
        [ 12, '#e6f598' ],
        [ 14, '#abdda4' ],
        [ 16, '#66c2a5' ],
        [ 18, '#3288bd' ]
      ]
    },
    'fill-opacity': 0.8
  }
});

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