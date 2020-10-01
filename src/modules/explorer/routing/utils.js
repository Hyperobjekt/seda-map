import { parseLocationsString } from './selectors'
import { loadFeaturesFromCoords } from '../map'

/**
 * Loads map features based on a string of locations
 * @param {string} locations locations formed as `{id},{lat},{lon}` separated by a `+`
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRoute = locations =>
  loadFeaturesFromCoords(parseLocationsString(locations))

/**
 * Loads map features from location parameter
 * @param {*} params
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRouteParams = params =>
  params.locations
    ? loadFeaturesFromRoute(params.locations)
    : Promise.resolve([])
