import * as scale from 'd3-scale'
import { getRegionDomain } from '../app/selectors/regions'

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
