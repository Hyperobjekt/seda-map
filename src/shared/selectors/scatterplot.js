import { REGION_BASE_VARS } from '../constants/regions'
import { isGapDemographic } from './demographics'
import * as scale from 'd3-scale'
import { getRegionDomain } from './regions'

/** min / max dot sizes */
export const DOT_SIZES = [4, 64]

/**
 * Variables contained in the base csv file for each region
 */
export const BASE_VARS = {
  counties: ['id', 'name', 'lat', 'lon', 'all_sz'],
  districts: ['id', 'name', 'lat', 'lon', 'all_sz'],
  schools: ['id', 'name', 'lat', 'lon', 'all_sz']
}

/**
 * Gets the configuration for base variables
 */
export const getBaseVars = () => BASE_VARS

/**
 * Gets the configuration for dot sizes
 */
export const getDotSize = () => DOT_SIZES

/**
 * Gets a map of which vars are in the base file for each region
 */
export const getBaseVarsByRegion = () => REGION_BASE_VARS

/**
 * Gets the vars for the map section
 */
export const getMapVars = (region, metric, demographic) => {
  if (region === 'schools') {
    return {
      yVar: 'all_' + metric,
      xVar: 'all_frl',
      zVar: 'all_sz'
    }
  }
  const useAll = ['m', 'f', 'p', 'np'].indexOf(demographic) > -1
  return {
    yVar: demographic + '_' + metric,
    xVar: useAll ? 'all_ses' : demographic + '_ses',
    zVar: demographic + '_sz'
  }
}

/**
 * Returns x,y,z variable names for the versus scatterplot
 * @param {string} metric  (metric id)
 * @param {string} demographic (gap demographic id)
 */
export const getVersusVarNames = (metric, demographic) => {
  let dem1 = demographic[0]
  let dem2 = demographic[1]
  // if poor / non-poor, get correct demographic and order
  if (dem2 === 'n') {
    dem1 = 'np'
    dem2 = 'p'
  }
  return [
    dem2 + '_' + metric,
    dem1 + '_' + metric,
    demographic + '_sz'
  ]
}

/**
 * Returns the x,y,z variables for the current selection
 * @param {string} region id
 * @param {string} metric id
 * @param {string} demographic id
 * @param {string} type ("chart" or "map")
 */
export const getVarNames = (
  region,
  metric,
  demographic,
  type = 'chart'
) => {
  // schools always use "all" subgroup
  if (region === 'schools') {
    return ['all_' + metric, 'all_frl', 'all_sz']
  }
  // default chart for gap demographics should be versus
  if (type === 'chart' && isGapDemographic(demographic)) {
    return getVersusVarNames(metric, demographic)
  }
  // use "all" SES option for the following demographics
  const useAll =
    ['m', 'f', 'p', 'np', 'a'].indexOf(demographic) > -1
  return [
    useAll ? 'all_ses' : demographic + '_ses',
    demographic + '_' + metric,
    demographic + '_sz'
  ]
}

/**
 * Gets the variables for the chart section
 * @param {string} region
 * @param {string} metric
 * @param {string} demographic
 */
export const getScatterplotVars = (
  region,
  metric,
  demographic
) => {
  const [xVar, yVar, zVar] = getVarNames(
    region,
    metric,
    demographic
  )
  return {
    yVar,
    xVar,
    zVar
  }
}

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
