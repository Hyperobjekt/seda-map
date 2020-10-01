import * as scale from 'd3-scale'
import { getRegionDomain } from '../../selectors/regions'

/** min / max dot sizes */
const DOT_SIZES = [4, 64]

/**
 * Variables contained in the base csv file for each region
 */
const BASE_VARS = {
  states: ['id', 'name', 'lat', 'lon', 'all_sz'],
  counties: ['id', 'name', 'lat', 'lon', 'all_sz'],
  districts: ['id', 'name', 'lat', 'lon', 'all_sz'],
  schools: ['id', 'name', 'lat', 'lon', 'all_sz']
}

/**
 * Gets the configuration for dot sizes
 */
const getDotSize = () => DOT_SIZES

/**
 * Gets the state IDs that belong to a certain state
 * @param {array} ids
 * @param {string} fips
 */
const getPrefixIds = (ids, prefix) => {
  if (ids) {
    return ids.filter(
      d => d.substring(0, prefix.length) === prefix
    )
  }
  return []
}

/**
 * Gets the configuration for base variables
 */
export const getBaseVars = () => BASE_VARS

/**
 * Returns a scale function that can be used to map data values
 * to dot sizes
 * @param {object} data data to generate scale for (e.g. { '01001': 3.4, ... })
 * @param {object} options range and exponent options for scale
 */
export const getSizerFunctionForRegion = (
  region,
  demographic,
  range = getDotSize(),
  exponent = 0.5
) => {
  return scale
    .scalePow()
    .exponent(exponent)
    .domain(getRegionDomain(demographic, region))
    .range(range)
    .clamp(true)
}

// /**
//  * Returns true if at least one active filter
//  * @param {*} filters
//  */
// const hasActiveFilters = filters => {
//   return Boolean(filters.prefix) || Boolean(filters.largest)
// }

// /**
//  * Return an array of IDs that match the filter params
//  * @param {*} data
//  * @param {*} filters
//  * @param {*} sizeVar
//  */
// export const getFilteredIds = (data, filters = {}, sizeVar) => {
//   if (!hasActiveFilters(filters) || !data || !data['name'])
//     return []
//   let ids = Object.keys(data['name'])
//   if (filters.prefix) {
//     ids = getPrefixIds(ids, filters.prefix)
//   }
//   if (filters.largest && data && data[sizeVar]) {
//     ids = ids
//       .sort((a, b) =>
//         data[sizeVar][a] > data[sizeVar][b] ? -1 : 1
//       )
//       .slice(0, filters.largest)
//   }
//   return ids
// }

/**
 * Checks the data store for the region and determines
 * which variables, if any, need to be fetched.
 * @param {*} data
 * @param {*} region
 * @param {*} varNames
 */
export const getMissingVarNames = (data, region, varNames) => {
  // always need to fetch vars for schools
  if (region === 'schools') return varNames
  return data
    ? varNames.filter(v => !Boolean(data[v]))
    : varNames
}
