import * as _debounce from 'lodash.debounce';

export const getViewportFromRoute = ({ params }) =>
  ['latitude', 'longitude', 'zoom']
    .reduce((acc, curr) => ({
      ...acc,
      [curr]: parseFloat(params[curr])
    }), {})

export const updateRoute = (props, updates) => {
  const routeParams = [ 'region', 'metric', 'demographic', 'zoom', 'latitude', 'longitude' ];
  const matches = { ...props.match.params, ...updates };
  props.history.push(
    '/' + routeParams.map(p => matches[p]).join('/')
  );
}

export const updateViewportRoute = _debounce((props, vp) => {
  if (vp.latitude && vp.longitude && vp.zoom) {
    const routeUpdates = [ 'latitude', 'longitude', 'zoom' ]
      .reduce((acc, curr) => ({ 
        ...acc, 
        [curr]: Math.round(vp[curr] * 100) / 100
      }), {})
    updateRoute(props, routeUpdates);
  }
}, 1000);