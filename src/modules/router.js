import * as _debounce from 'lodash.debounce';
import * as polylabel from 'polylabel';
import { push } from 'connected-react-router';

/**
 * Variables stored in the root, in order
 */
export const routeVars = [ 
  'region', 
  'metric', 
  'demographic', 
  'zoom', 
  'lat', 
  'lon', 
  'locations' 
];

/**
 * Gets a route string to represent the feature
 * @param {object} feature 
 */
export const getLocationFromFeature = (feature) => {
  let point;
  if (feature.geometry.type === 'MultiPolygon') {
    point = polylabel(feature.geometry.coordinates[0]);
  } else if (feature.geometry.type === 'Polygon') {
    point = polylabel(feature.geometry.coordinates)
  } else if (feature.geometry.type === 'Point') {
    point = feature.geometry.coordinates;
  } else {
    throw new Error('unsupported feature geometry type')
  }
  return feature.properties.id + ',' +
    (Math.round(point[1] * 100) / 100) + ',' +
    (Math.round(point[0] * 100) / 100)
}

/**
 * Gets an array of objects representing the locations in the pathname
 * @param {string} pathname 
 * @returns {Array<{id, lat, lon }>}
 */
export const parseLocationsString = (locations) => {
  if (!locations) { return []; }
  const locationParts = ['id', 'lat', 'lon' ];
  return locations.split('+').map(l => 
    l.split(',')
      .reduce((acc, curr, i) => ({ 
        ...acc, 
        [locationParts[i]]: curr
      }), {})
  );
}

/**
 * Convert array of location objects to string
 * @param {*} locations 
 */
export const locationsToString = (locations) =>
  locations.reduce((acc, curr, i) => (
    acc + 
    curr.id + ',' + curr.lat + ',' + curr.lon +
    (i === (locations.length-1) ? '' : '+')
  ), '');

/**
 * Adds a feature to the route pathname
 * @param {string} pathname
 * @param {object} feature 
 * @returns {string}
 */
export const addFeatureToPathname = (pathname, feature) => {
  const currentRoute = getParamsFromPathname(pathname);
  const locations = currentRoute.locations ?
    currentRoute.locations + '+' + getLocationFromFeature(feature) :
    getLocationFromFeature(feature);
  return getPathnameFromParams(currentRoute, { locations })
}

/**
 * Removes a location from the pathname
 * @param {string} pathname 
 * @param {string} locationId 
 */
export const removeLocationFromPathname = (pathname, locationId) => {
  const params = getParamsFromPathname(pathname)
  const locations = parseLocationsString(params.locations)
  const newLocations = locations.filter(l => l.id !== locationId)
  return getPathnameFromParams(params, { locations: locationsToString(newLocations) })
}

/**
 * Get a route parameters object based on the string
 * @param {string} path 
 * @returns {object} e.g. { region: 'counties', metric: 'avg', ... }
 */
export const getParamsFromPathname = (path) =>
  path.substring(1, path.length)
    .split('/')
    .reduce((acc, curr, i) => ({
      ...acc,
      [routeVars[i]]: curr
    }), {})

/**
 * Get the route string based on some passed parameters
 * @param {object} params route parameters object 
 * @param {object} updates (optional) any updates to make to the path 
 * @returns {string} e.g. /counties/avg/all/5/37/-97
 */
export const getPathnameFromParams = (params, updates = {}) => {
  const matches = { ...params, ...updates };
  return '/' + routeVars
    .filter(p => !!matches[p])
    .map(p => matches[p]).join('/')
}

/**
 * Pulls the viewport parameters from the route parameters object
 * @param {object} params route parameters object 
 * @returns {object} e.g. { latitude: 37, longitude: -97, zoom: 5 }
 */
export const getViewportFromRoute = ({ params }) =>
  ['latitude', 'longitude', 'zoom']
    .reduce((acc, curr) => ({
      ...acc,
      [curr]: parseFloat(params[curr !== 'zoom' ? curr.substr(0,3) : curr])
    }), {})

/**
 * Pushes an updated route to history
 * @param {object} props props from a component connected to the router
 * @param {object} updates an object of route params to update
 */
export const updateRoute = (props, updates) => {
  props.history.push(
    getPathnameFromParams(props.match.params, updates)
  );
}

/**
 * Pushes an updated viewport to history. The function is debounced
 * because it is connected to the map `move` event which fires rapidly.
 * @param {object} props props from a component connected to the router
 * @param {object} vp an object with the updated viewport params
 */
export const updateViewportRoute = _debounce((props, vp) => {
  if (vp.latitude && vp.longitude && vp.zoom) {
    const paramMap = [ 'latitude', 'longitude', 'zoom' ]
    const routeUpdates = [ 'lat', 'lon', 'zoom' ]
      .reduce((acc, curr, i) => ({ 
        ...acc, 
        [curr]: Math.round(vp[paramMap[i]] * 100) / 100
      }), {})
    updateRoute(props, routeUpdates);
  }
}, 1000);

export const updateRegionInRoute = (dispatch, pathname, region) => {
  const currentRoute = getParamsFromPathname(pathname);
  dispatch(push(getPathnameFromParams(currentRoute, { region })))
}

/**
 * Pushes a location to the route based on a feature
 * @param {*} dispatch 
 * @param {string} pathname
 * @param {object} feature 
 */
export const addFeatureToRoute = (dispatch, pathname, feature) => {
  const newRoute = addFeatureToPathname(pathname, feature)
  dispatch(push(newRoute))
}

/**
 * Pushes a location to the route based on a feature
 * @param {*} dispatch 
 * @param {string} pathname
 * @param {object} feature 
 */
export const removeFeatureFromRoute = (dispatch, pathname, feature) => {
  const newRoute = removeLocationFromPathname(pathname, feature.properties.id)
  dispatch(push(newRoute))
}