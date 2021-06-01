import { getMetricIdFromVarName, getColorRange } from './metrics'
import {
  isGapVarName,
  getDemographicIdFromVarName,
  isGapDemographic
} from './demographics'
import {
  getValuePositionInRange,
  formatPercentDiff,
  formatPercent,
  formatNumber,
  getPositionFromValue
} from '../../../../shared/utils'
import { getStateAbbr } from '../../../../shared/utils/states'
import { getRegionFromLocationId } from './regions'
import { NO_SES_DEMOGRAPHICS } from '../constants/demographics'

// values provided by SEDA team for calulation distance from regression
const FUNC_VARS = {
  states: {
    avg: null,
    grd: null,
    coh: null
  },
  counties: {
    avg: [0.061, 0.834, -0.085, 0.011],
    grd: [0.996, 0.05, 0.002, -0.002],
    coh: [0.004, 0.006, 0.006, 0]
  },
  districts: {
    avg: [-0.144, 0.892, 0.161, 0.04],
    grd: [0.997, 0.052, 0.013, 0.002],
    coh: [0.004, 0.013, 0.005, 0.001]
  },
  schools: {
    avg: [-2.739, 9.46, -11.653, 7.671],
    grd: [0.995, 0.029, 0.068, 0.103],
    coh: [-0.011, -0.006, 0.09, -0.019]
  }
}

/**
 * Gets how far the provided value is from the regression
 * @param {*} value
 * @param {*} metricId
 * @param {*} regionId
 */
export const getPredictedValue = (value, metricId, regionId) => {
  // only have predicted values for counties, districts and schools
  if (
    ['counties', 'districts', 'schools'].indexOf(regionId) === -1
  )
    return null
  const b = FUNC_VARS[regionId][metricId]
  const result =
    b[0] +
    b[1] * value +
    b[2] * Math.pow(value, 2) +
    b[3] * Math.pow(value, 3)
  return result
}

/** checks if value is present */
export const hasVal = val => val || val === 0

/**
 * Returns an array containing the min and max for the
 * provided varname and region
 */
export const getColorRangeForVarName = (
  varName,
  region,
  type
) => {
  const metricId = getMetricIdFromVarName(varName)
  const demId = getDemographicIdFromVarName(varName)
  return getColorRange(metricId, demId, region, type)
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

const getMetricVarName = (metric, demographic = 'all') => {
  return demographic + '_' + metric
}

/**
 * Gets the secondary var name for the given demographic
 * and substitues "all" for the demographic if SES is
 * unavailable for the given demographic.
 * @param {*} secondary
 * @param {*} demographic
 * @returns
 */
const getSecondaryVarName = (secondary, demographic) => {
  // use "all" SES option for the following demographics
  if (secondary === 'ses') {
    const useAll = NO_SES_DEMOGRAPHICS.indexOf(demographic) > -1
    return useAll ? 'all_ses' : demographic + '_ses'
  }
  return demographic + '_' + secondary
}

const getSizeVarName = demographic => {
  return demographic + '_sz'
}

/**
 * Returns x,y,z variable names for the versus scatterplot
 * @param {string} metric  (metric id)
 * @param {string} demographic (gap demographic id)
 */
const getVersusVarNames = (metric, demographic) => {
  let dem1 = demographic[0]
  let dem2 = demographic[1]
  // if poor / non-poor, get correct demographic and order
  if (dem2 === 'n') {
    dem1 = 'np'
    dem2 = 'p'
  }
  return [
    dem1 + '_' + metric,
    dem2 + '_' + metric,
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
  secondary = 'ses',
  demographic,
  type = 'chart'
) => {
  const isGap = isGapDemographic(demographic)
  // schools always use "all" subgroup
  if (region === 'schools') {
    return ['all_frl', 'all_' + metric, 'all_sz']
  }
  // default chart for gap demographics should be versus
  if (type === 'chart' && isGap) {
    return getVersusVarNames(metric, demographic)
  }
  // always use SES as secondary when no gap
  const secondaryVarName = getSecondaryVarName(
    isGap ? secondary : 'ses',
    demographic
  )
  return [
    secondaryVarName,
    getMetricVarName(metric, demographic),
    getSizeVarName(demographic)
  ]
}

/**
 * Mergest data from the feature store and the
 * scatterplot store for the provided identifier.
 * @param {*} id
 * @param {*} data
 */
export const getDataForId = (id, data, featureData = {}) => {
  if (!data && !featureData) return null
  data = data || {}
  featureData = featureData || {}
  const feature = featureData[id] || {}
  const base = {
    id,
    state: getStateAbbr(id),
    region: getRegionFromLocationId(id),
    ...feature
  }
  return Object.keys(data).reduce((acc, curr) => {
    // only add data if it exists
    if (data[curr][id] || data[curr][id] === 0) {
      acc[curr] = data[curr][id]
    }
    return acc
  }, base)
}

export const isUnavailable = value => {
  return value === -999 || (!value && value !== 0)
}
