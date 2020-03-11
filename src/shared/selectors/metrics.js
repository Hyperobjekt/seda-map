import { METRICS, KEY_METRIC_IDS } from '../constants/metrics'
import { isGapDemographic } from './demographics'

/**
 * Gets the configuration for metrics
 */
export const getMetrics = () => METRICS

export const getKeyMetrics = () =>
  METRICS.filter(m => KEY_METRIC_IDS.indexOf(m.id) > -1)

/**
 * Gets the metric object corresponding to the provided ID
 */
export const getMetricById = id =>
  getMetrics().find(m => m.id === id)

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
    default:
      return getMidLowHigh(value, [0, 0])
  }
}

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
export const getMetricRange = (
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
