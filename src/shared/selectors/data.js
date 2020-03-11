import {
  getMetricIdFromVarName,
  getMetricRange
} from './metrics'
import {
  isGapVarName,
  getDemographicIdFromVarName
} from './demographics'
import {
  getValuePositionInRange,
  formatPercentDiff,
  formatPercent,
  formatNumber,
  getPositionFromValue
} from '../utils'

// values provided by SEDA team for calulation distance from regression
const FUNC_VARS = {
  counties: {
    avg: [-0.051, 0.795, 0.033, 0.023],
    grd: [0.99, 0.046, 0.001, 0.001],
    coh: [0.018, -0.003, 0.008, 0.006]
  },
  districts: {
    avg: [-0.185, 0.812, 0.126, 0.03],
    grd: [0.989, 0.045, 0.011, 0.002],
    coh: [0.015, 0.01, 0.004, 0.001]
  },
  schools: {
    avg: [2.567, -8.308, 9.249, -5.765],
    grd: [1.183, -0.468, 0.406, -0.134],
    coh: [0.069, -0.139, 0.109, -0.041]
  }
}

/**
 * Gets how far the provided value is from the regression
 * @param {*} value
 * @param {*} metricId
 * @param {*} regionId
 */
export const getPredictedValue = (value, metricId, regionId) => {
  const b = FUNC_VARS[regionId][metricId]
  return (
    b[0] +
    b[1] * value +
    b[2] * Math.pow(value, 2) +
    b[3] * Math.pow(value, 3)
  )
}

/**
 * Returns an array containing the min and max for the
 * provided varname and region
 */
export const getMetricRangeFromVarName = (
  varName,
  region,
  type
) => {
  const metricId = getMetricIdFromVarName(varName)
  const demId = getDemographicIdFromVarName(varName)
  return getMetricRange(metricId, demId, region, type)
}

/**
 * Returns the diverging midpoint for the provided varName
 * @param {string} varName
 */
export const getMidpointForVarName = varName => {
  if (
    varName.split('_')[1] === 'grd' &&
    !isGapVarName(varName)
  ) {
    return 1
  }
  // set midpoint out of view for FRL
  if (varName.split('_')[1] === 'frl') {
    return -10
  }
  return 0
}

/**
 * Gets the position of where the bar should extend to
 * for a value based on the metric
 * @param {string} varName
 * @param {number} value
 * @param {array} range
 */
export const getPositionForVarNameValue = (
  varName,
  value,
  range
) => {
  const midPoint = getMidpointForVarName(varName)
  return varName.indexOf('frl') > -1
    ? getValuePositionInRange(value, range)
    : getPositionFromValue(value, range, midPoint)
}

/**
 * Gets the percent value of where the value sites on
 * the scale for the metric.
 * @param {*} value
 * @param {*} varName
 * @returns {number} between 0 - 1
 */
export const getValuePositionForVarName = (
  value,
  varName,
  region,
  type
) => {
  if (!value && value !== 0) {
    return null
  }
  return getValuePositionInRange(
    value,
    getMetricRangeFromVarName(varName, region, type)
  )
}

/**
 * Returns a function to format values for the provided varName
 * @param {*} varName
 */
export const getFormatterForVarName = varName => {
  const metric = getMetricIdFromVarName(varName)
  const isGap = isGapVarName(varName)

  if (isGap && metric === 'grd') {
    return formatPercent
  }
  switch (metric) {
    case 'grd':
      return formatPercentDiff
    case 'frl':
    case 'seg':
    case 'min':
      return formatPercent
    default:
      return formatNumber
  }
}
