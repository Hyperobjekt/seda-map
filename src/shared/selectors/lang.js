import {
  isGapDemographic,
  getMetricIdFromVarName,
  getDemographicIdFromVarName,
  getFormatterForVarName,
  getGapDemographics
} from '.'

import LANG from '../constants/en'
import { getRegions } from './regions'
import { getDemographics, getGaps } from './demographics'
import { getMetrics } from './metrics'
import { getMidpointForVarName } from './data'

const isStringMatch = (s1, s2) =>
  s1 &&
  s2 &&
  (s1.toUpperCase() === s2.toUpperCase() ||
    s1 === '*' ||
    s2 === '*')

const isViewMatch = isStringMatch
const isRegionMatch = isStringMatch
const isMetricMatch = isStringMatch
const isSecondaryMatch = isStringMatch

const isDemographicMatch = (d1, d2) =>
  (d1 === 'gap' && isGapDemographic(d2)) ||
  (d2 === 'gap' && isGapDemographic(d1)) ||
  (d1 === 'nongap' && !isGapDemographic(d2)) ||
  (d2 === 'nongap' && !isGapDemographic(d1)) ||
  isStringMatch(d1, d2)

/**
 * Returns true if the provided key matches the region,
 * demographic, and type passed
 */
const isKeyMatch = (
  key,
  { region, demographic, view, metric, secondary = 'ses' }
) => {
  if (key === '*') {
    return true
  }
  const [
    contextId,
    viewId,
    regionId,
    metricId,
    secondaryId,
    demographicId
  ] = key.split('_')
  return (
    contextId &&
    isViewMatch(view, viewId) &&
    isRegionMatch(region, regionId) &&
    isMetricMatch(metric, metricId) &&
    isSecondaryMatch(secondary, secondaryId) &&
    isDemographicMatch(demographic, demographicId)
  )
}

/** Checks if the LANG key exists */
export const hasLangKey = key =>
  LANG.hasOwnProperty(key.toUpperCase())

/**
 * Checks the LANG for any context-specific keys for
 * the provided values.
 */
export const populateContext = (values = {}, prefix) => {
  return Object.keys(values).reduce(
    (obj, key) => ({
      ...obj,
      [key]:
        prefix && hasLangKey(prefix + '_' + values[key])
          ? getLang(prefix + '_' + values[key])
          : hasLangKey('LABEL_' + values[key])
          ? getLang('LABEL_' + values[key]).toLowerCase()
          : values[key]
    }),
    {}
  )
}

/**
 * Returns an array of paragraphs matching the provided context
 * @param {string} contextPrefix the prefix used in the LANG for this context
 * @param {object} contextValues the values for the current context
 */
export const getLanguageForContext = (
  contextPrefix,
  contextValues
) =>
  Object.keys(LANG)
    .filter(
      k =>
        k.startsWith(contextPrefix) &&
        isKeyMatch(k, contextValues)
    )
    .map(k =>
      getLang(k, populateContext(contextValues, contextPrefix))
    )

/**
 * Takes a text string and injects object keys that
 * match $[key]
 * @param {*} text
 * @param {*} params
 */
const interpolate = (text, params = {}) => {
  const arr = splitLang(text)
  return arr
    .map(a => {
      if (a && a[0] !== '$') {
        return a
      } else {
        a = a.replace('$[', '')
        a = a.replace(']', '')
        if (params[a]) {
          return params[a]
        }
        return a
      }
    })
    .join('')
}

/**
 * Gets the language string for the given key and data
 * @param {string} key
 * @param {object} props
 */
export const getLang = (key = '', props = {}) => {
  key = key.toUpperCase()
  if (!LANG[key]) {
    return key
  }
  return Object.keys(props).length > 0
    ? interpolate(LANG[key], props)
    : LANG[key]
}

/**
 * Gets the label for the provided metric ID
 * @param {string} id
 * @return {string}
 */
export const getLabel = id => {
  return getLang('LABEL_' + id.toUpperCase())
}

/** Split a lang string at the vars formatted as $[var] */
export const splitLang = text =>
  text.split(/(\$\[[a-zA-Z0-9_]*\])/)

// const getGapLabel = (gapId) => {
//   const dem1 =
//     getDemographicById(gapId[0])
//   const dem2 =
//     getDemographicById(gapId[1] === 'n' ? 'np' : gapId[1])
//   return getLang('LABEL_GAP', {
//     demographic1: dem1.label,
//     demographic2: dem2.label
//   }).toLowerCase()
// }

/**
 * Gets the proper language key to use given the metric and value
 * @param {*} metricId
 * @param {*} value
 */
const getDescriptionLangKey = (metricId, value) => {
  switch (metricId) {
    case 'avg':
    case 'coh':
      return value > 0
        ? `VALUE_${metricId}_HIGH`
        : value < 0
        ? `VALUE_${metricId}_LOW`
        : value === 0
        ? `VALUE_${metricId}_MID`
        : 'UNAVAILABLE'
    case 'grd':
      return value > 1
        ? `VALUE_${metricId}_HIGH`
        : value < 1
        ? `VALUE_${metricId}_LOW`
        : value === 1
        ? `VALUE_${metricId}_MID`
        : 'UNAVAILABLE'
    case 'ses':
      return value > 2.5
        ? `VALUE_SES_ULTRA_HIGH`
        : value > 1.5
        ? `VALUE_SES_VERY_HIGH`
        : value > 0.5
        ? `VALUE_SES_HIGH`
        : value > -0.5
        ? `VALUE_SES_MID`
        : value > -1.5
        ? `VALUE_SES_LOW`
        : value > -2.5
        ? `VALUE_SES_VERY_LOW`
        : `VALUE_SES_ULTRA_LOW`
    case 'seg':
      return `VALUE_SEG`
    case 'frl':
      return 'VALUE_FRL'
    default:
      return 'DESCRIPTION_UNAVAILABLE'
  }
}

export const getDifferenceForMetric = (metricId, value) => {
  switch (metricId) {
    case 'ses':
      return getLang(
        value > 1.5
          ? `DIFF_VERY_HIGH`
          : value > 0.5
          ? `DIFF_HIGH`
          : value > -0.5
          ? `DIFF_MID`
          : value > -1.5
          ? `DIFF_LOW`
          : `DIFF_VERY_LOW`
      )
    default:
      return null
  }
}

/**
 * Returns a description string given the provided variable and
 * value.
 *    e.g. "Test scores are 1.34 levels above U.S. Average" is
 *          returned for `getDescriptionFromVarName('all_avg', 1.34)`
 */
export const getDescriptionForVarName = (varName, value) => {
  if ((!value || value === -9999) && value !== 0) {
    return getLabelFromVarName(varName) + ' unavailable'
  }
  const metricId = getMetricIdFromVarName(varName)
  const formatter = getFormatterForVarName(varName)
  const demographicId = getDemographicIdFromVarName(varName)
  const langKey = getDescriptionLangKey(metricId, value)
  const isGap = isGapDemographic(demographicId)
  const formattedValue =
    metricId === 'seg' || metricId === 'min'
      ? formatter(value)[0] === '-'
        ? formatter(value).substr(1)
        : formatter(value)
      : '' + formatter(value)

  if (!isGap) {
    return getLang(langKey, {
      value:
        formattedValue[0] === '-'
          ? formattedValue.substring(1)
          : formattedValue,
      students: getLang('LABEL_STUDENTS_' + demographicId)
    })
  }
  // gap demographic lang
  const context = {
    demographic1: getLang(
      'LABEL_' + getGapDemographics(demographicId)[0]
    ),
    demographic2: getLang(
      'LABEL_' + getGapDemographics(demographicId)[1]
    ),
    difference: getDifferenceForMetric(metricId, value),
    highLow: value < 0 ? 'lower' : 'higher'
  }
  return getLang('VALUE_' + metricId + '_GAP', {
    value: formattedValue,
    demographic: getLang('LABEL_SHORT_' + demographicId),
    ...context
  })
}

/**
 * Returns string label for provided `varName`
 */
export const getLabelForVarName = (varName, context = {}) => {
  const [demographic, metric] = varName.split('_')
  return demographic === 'all'
    ? getLang('LABEL_' + metric, context)
    : getLang('LABEL_' + metric + '_' + demographic, context)
}

/**
 * Returns array containing low / high labels for legend bar
 */
export const getLegendEndLabelsForVarName = (
  varName,
  langPrefix = 'LEGEND_'
) => {
  const [demographic, metric] = varName.split('_')
  const isGap = isGapDemographic(demographic)
  return isGap
    ? [
        getLang(`${langPrefix}LOW_${metric}_${demographic}`),
        getLang(`${langPrefix}HIGH_${metric}_${demographic}`)
      ]
    : [
        getLang(`${langPrefix}LOW_${metric}`),
        getLang(`${langPrefix}HIGH_${metric}`)
      ]
}

/**
 * Get the label for the provided varnames and values
 * @param {*} values
 */
export const getTooltipText = values => {
  const text = Object.keys(values).reduce((str, varName) => {
    return (
      str + getDescriptionForVarName(varName, values[varName])
    )
  }, '')
  return text !== '' ? text : getLang('DATA_UNAVAILABLE')
}

export const getMetricDescription = metricId => {
  return getLang('TAB_METRIC_' + metricId.toUpperCase())
}

export const getSelectionLabel = panelId => {
  switch (panelId) {
    case 'metric':
      return 'Educational Opportunity Metric'
    case 'demographic':
      return 'Subgroup / Gap'
    case 'region':
      return 'Region'
    case 'filter':
      return 'Data Filters'
    case 'location':
      return 'Locations'
    default:
      return
  }
}

/**
 * Returns the page heading based on selections
 */
export const getTitleFromSelections = ({
  metric,
  demographic,
  region
}) => {
  const isGap = isGapDemographic(demographic.id)
  const metricConcept = getLang(
    `LABEL_CONCEPT_${metric.id.toUpperCase()}`
  )
  return isGap
    ? `${metricConcept} Gaps in U.S. ${region.label}`
    : `${metricConcept} in U.S. ${region.label}`
}

/**
 * Returns the page subheading based on selections
 */
export const getSubtitleFromSelections = ({
  metric,
  demographic
}) => {
  const studentLabel = getLang(
    'LABEL_STUDENTS_' + demographic.id.toUpperCase()
  )
  const isGap = isGapDemographic(demographic.id)
  return !isGap
    ? `shown by ${metric.label} for ${studentLabel}`
    : `shown by ${studentLabel} ${metric.label}`
}

/**
 * Gets the label for the provided metric ID
 * @param {string} metric id or var name
 * @return {string}
 */
export const getMetricLabel = (id, prefix = 'LABEL') => {
  if (id.includes('_')) {
    // this is a var name, grab the metric portion
    id = id.split('_')[1]
  }
  return getLang(prefix + '_' + id)
}

/**
 * Gets an object mapping of variable name to label
 * @param {array} varNames an array of variable names
 */
export const getLabelsFromVarNames = varNames => {
  return varNames.reduce((labelCollection, varName) => {
    labelCollection[varName] = getLabelFromVarName(varName)
    return labelCollection
  }, {})
}

/**
 * Returns a string with the label for the given variable name, in
 * the format {METRIC_LABEL} ({DEMOGRAPHIC_LABEL})
 * @param {*} varName
 */
export const getLabelFromVarName = varName => {
  const [demId, metricId] = varName.split('_')
  return (
    getMetricLabel(metricId) +
    ' (' +
    getDemographicLabel(demId) +
    ')'
  )
}

/**
 * Gets the label for the provided demographic ID
 * @param {string} id
 * @returns {string}
 */
export const getDemographicLabel = (id, prefix = 'LABEL') => {
  if (id.includes('_')) {
    // this is a var name, grab the metric portion
    id = id.split('_')[0]
  }
  return getLang(prefix + '_' + id)
}

/**
 * Gets the label for the provided region ID
 * @param {string} id
 * @returns {string}
 */
export const getRegionLabel = id => {
  let region = getRegions().find(r => r.id === id)
  if (!region) {
    throw new Error('no region found for ' + id)
  }
  return region.label
}

export const getSingleOrNoneQuantifier = num =>
  num === 0 ? 'NONE' : num === 1 ? 'SINGLE' : 'MANY'

export const getMidpointQuantifier = (value, mid = 0) =>
  value === mid ? 'MID' : value < mid ? 'LOW' : 'HIGH'

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
    ? `LOW`
    : `ULTRA_LOW`
}

export const getLangWithSingleOrNone = (num, prefix) =>
  getLang(prefix + '_' + getSingleOrNoneQuantifier(num), { num })

export const getLangDiverging = (
  varName,
  value,
  prefix = 'VALUE'
) => {
  const mid = getMidpointForVarName(varName)
  const metricId = getMetricIdFromVarName(varName)
  const quantifier =
    metricId === 'ses'
      ? getSesQuantifier(value)
      : getMidpointQuantifier(value, mid)
  return getLang(prefix + '_' + metricId + '_' + quantifier)
}

export const getTooltipMetricLang = (varName, value) =>
  getLangDiverging(varName, value, 'TOOLTIP_DESC')
