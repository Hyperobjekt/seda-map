import * as scale from 'd3-scale'
import * as d3array from 'd3-array'

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
 * Gets the configuration for base variables
 */
export const getBaseVars = () => BASE_VARS

/** Gets the domain for the given region */
// const getRegionDomain = (demographic, region) => {
//   return region === 'schools'
//     ? REGION_DOMAINS['schools']
//     : REGION_DOMAINS[demographic + '_' + region]
// }

/**
 * Returns a scale function that can be used to map data values
 * to dot sizes
 * @param {object} data data to generate scale for (e.g. { '01001': 3.4, ... })
 * @param {object} options range and exponent options for scale
 */
export const getDotSizeScale = ({
  extent = [0, 1],
  range = getDotSize(),
  exponent = 0.5
}) => {
  return scale
    .scalePow()
    .exponent(exponent)
    .domain(extent)
    .range(range)
    .clamp(true)
}

export const getDataExtent = (data, accessor) => {
  if (typeof accessor === 'string')
    return d3array.extent(data, d => parseFloat(d[accessor]))
  if (typeof accessor === 'function')
    return d3array.extent(data, accessor)
  throw new Error('invalid accessor to retrieve extent')
}

/**
 * Pads a provided extent
 */
export const getPaddedExtent = (extent, amount = 0.1) => {
  const padding = (extent[1] - extent[0]) * amount
  // const interval = getIntervalForExtent(extent)
  const extendedExtent = [
    extent[0] - padding,
    extent[1] + padding
  ]
  return extendedExtent
}

export const getIntervalForExtent = extent => {
  const distance = extent[1] - extent[0]
  if (distance < 0.01) return 0.001
  if (distance < 0.1) return 0.01
  if (distance < 1) return 0.1
  if (distance < 2) return 0.25
  if (distance < 4) return 0.5
  if (distance < 8) return 1
  return 2
}

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
  return data ? varNames.filter(v => !data[v]) : varNames
}
