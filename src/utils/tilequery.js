import axios from 'axios';
import { parseLocationsString } from '../modules/router';

/**
 * Returns the feature with an id property that matches the
 * provided ID
 * @param {string} id 
 * @param {FeatureCollection} collection 
 * @returns {Feature}
 */
const getFeatureFromCollection = (id, collection) => {
  const feature = collection
    .find(f => f.properties.id === id);
  if (!feature) {
    throw new Error('feature ' + id + ' not found from tilequery API')
  }
  return feature;
}

/**
 * Gets the tilequery URL for the given region, latitude and longitude
 * @param {string} region 
 * @param {number} lat 
 * @param {number} lon 
 * @returns {string}
 */
const getTilequeryUrl = (region, lat, lon) => 
  'https://api.mapbox.com/v4/'
  + process.env.REACT_APP_MAPBOX_USER
  + '.' + region + '-' 
  // TODO: update to prod when it's available
  + (process.env.NODE_ENV === 'production' ? 'dev' : 'dev')
  + '/tilequery/'
  + lon + ',' + lat + '.json?radius=10000&access_token=' 
  + process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

/**
 * Loads a feature from a location object containing a feature ID,
 * latitude, and longitude
 * @param {object} location 
 * @returns {Promise<Feature>}
 */
export const loadFeatureFromCoords = ({ id, lat, lon }) => {
  const region = id.length === 5 ? 'counties' :
    id.length === 12 ? 'schools' : 'districts';
  return axios.get(getTilequeryUrl(region, lat, lon))
    .then((res) => {
      return getFeatureFromCollection(id, res.data.features)
    })
}

/**
 * Loads map features based on a string of locations
 * @param {string} locations locations formed as `{id},{lat},{lon}` separated by a `+`
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromCoords = (locationsArray) => 
  Promise.all(
    locationsArray.map(l => loadFeatureFromCoords(l))
  )

/**
 * Loads map features based on a string of locations
 * @param {string} locations locations formed as `{id},{lat},{lon}` separated by a `+`
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRoute = (locations) =>
  loadFeaturesFromCoords(parseLocationsString(locations))

/**
 * Loads map features from location parameter
 * @param {*} params 
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRouteParams = (params) =>
  params.locations ? 
    loadFeaturesFromRoute(params.locations) :
    Promise.resolve([])