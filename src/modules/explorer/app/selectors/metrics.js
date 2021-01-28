import { METRICS, KEY_METRIC_IDS } from '../constants/metrics'
import { isGapDemographic } from './demographics'

/**
 * Gets the configuration for metrics
 */
export const getMetrics = () => METRICS

/**
 * Returns metric ID's available for the provided region
 * @param {*} region
 */
export const getMetricIdsForRegion = region => {
  return METRICS.filter(
    m => !m.regions || m.regions.indexOf(region) > -1
  ).map(m => m.id)
}

export const getKeyMetrics = () =>
  METRICS.filter(m => KEY_METRIC_IDS.indexOf(m.id) > -1)

/**
 * Gets the metric object corresponding to the provided ID
 */
export const getMetricById = id =>
  getMetrics().find(m => m.id === id)

/**
 * Gets the secondary metric ids available for the demographic
 * @param {*} dem
 */
export const getSecondaryForDemographic = dem => {
  const metrics = {
    ses: ['wb', 'wh'],
    seg: ['wb', 'wh', 'pn'],
    min: ['wb', 'wh']
  }
  return Object.keys(metrics).filter(
    m => metrics[m].indexOf(dem) > -1
  )
}

/**
 * Returns true if the provided demographic has a secondary chart
 * @param {*} dem
 */
export const hasSecondaryChart = dem => {
  const isGap = isGapDemographic(dem)
  if (!isGap) return false
  const secondaryCharts = getSecondaryForDemographic(dem)
  return secondaryCharts.length > 0
}

/**
 * Returns the metric id portion of the variable name
 */
export const getMetricIdFromVarName = varName =>
  typeof varName === 'string' ? varName.split('_')[1] : null

/**
 * Returns the metric object that corresponds to the metric
 * id in the variable name.
 * @param {string} varName
 */
export const getMetricFromVarName = varName =>
  getMetricById(getMetricIdFromVarName(varName))

/** Checks if a value falls within the provided mid range */
const getMidLowHigh = (value, midRange = [-0.25, 0.25]) => {
  return value < midRange[0]
    ? 'LOW'
    : value > midRange[1]
    ? 'HIGH'
    : 'MID'
}

/**
 * Returns either 'LOW', 'MID', or 'HIGH' based on the provided
 * metric ID and value
 * @param {*} metricId
 * @param {*} value
 */
export const valueToLowMidHigh = (metricId, value) => {
  if (!value && value !== 0) {
    return 'NONE'
  }
  switch (metricId) {
    case 'avg':
      return getMidLowHigh(value, [-0.25, 0.25])
    case 'grd':
      return getMidLowHigh(value, [0.965, 1.035])
    case 'coh':
      return getMidLowHigh(value, [-0.025, 0.025])
    case 'ses':
      return getSesQuantifier(value)
    case 'frl':
      return 'NONE'
    default:
      return getMidLowHigh(value, [0, 0])
  }
}

/**
 * Returns a quantifier for the provided SES value
 * @param {*} value
 */
export const getSesQuantifier = value => {
  return value > 2.5
    ? `ULTRA_HIGH`
    : value > 1.5
    ? `VERY_HIGH`
    : value > 0.5
    ? `HIGH`
    : value > -0.5
    ? `MID`
    : value > -1.5
    ? `LOW`
    : value > -2.5
    ? `VERY_LOW`
    : `ULTRA_LOW`
}

/**
 * Returns true for any variable names that should be inverted
 * @param {*} varName
 */
export const getInvertedFromVarName = varName =>
  varName.includes('frl')

/**
 * Returns true if the provided key matches the region,
 * demographic, and type passed
 */
const isRangeKeyMatch = (key, { region, demographic, type }) => {
  if (key === '*') {
    return true
  }
  const [t, r, d = false] = key.split('_')
  return (
    (t === '*' || t === type) &&
    (r === '*' || r === region) &&
    (d === '*' ||
      d === demographic ||
      (d === 'gap' && isGapDemographic(demographic)) ||
      !d)
  )
}

/**
 * gets the range for the metric, or an alternate range
 * if a variant is specified
 * @param {string} id metric id
 * @param {string} demographic demographic to get the range for
 * @param {string} region region to get the range for
 * @param {string} type type of range, if using separate map / chart ranges (e.g. 'map')
 */
export const getColorRange = (
  id,
  demographic,
  region,
  type = ''
) => {
  const metric = getMetricById(id)
  if (!metric || !metric.range) {
    throw new Error(`no range specified for metric ${id}`)
  }
  const rangeKey = Object.keys(metric.range).find(k =>
    isRangeKeyMatch(k, { demographic, region, type })
  )
  return rangeKey && metric.range[rangeKey]
    ? metric.range[rangeKey]
    : null
}
