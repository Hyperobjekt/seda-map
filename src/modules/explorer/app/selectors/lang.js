import {
  isGapDemographic,
  getMetricIdFromVarName,
  getDemographicIdFromVarName,
  getFormatterForVarName,
  getGapDemographics
} from '.'

import LANG from '../constants/en'
import { getMidpointForVarName } from './data'
import { getStateName } from '../../../../shared/utils/states'

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
  if ((!value || value === -999) && value !== 0) {
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
 * Pulls the demographic and metric labels from a var name
 * @param {*} varName
 * @param {*} prefix
 * @returns {[string, string]} [demographicLabel, metricLabel]
 */
export const getSplitVarNameLabels = (varName, prefix) => {
  return varName.split('_').map(v => getPrefixLang(v, prefix))
}

/**
 * Returns string label for provided `varName`
 */
export const getLabelForVarName = (
  varName,
  context = {},
  prefix = 'LABEL'
) => {
  return getPrefixLang(varName, prefix, context)
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

export const getPrefixLang = (id, prefix = 'LABEL', props) => {
  if (!id) return ''
  if (typeof id === 'string') {
    id = [id]
  }
  return getLang(prefix + '_' + id.join('_'), props)
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
  return getPrefixLang(id, prefix)
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
  return getPrefixLang(id, prefix)
}

/**
 * Gets the label for the provided region ID
 * @param {string} id
 * @returns {string}
 */
export const getRegionLabel = (id, prefix = 'LABEL') => {
  return getPrefixLang(id, prefix)
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

// TODO: removed during filters refactor, need to revise to get human readable filters

// export const getFiltersLang = (
//   filters,
//   region,
//   idToName = getStateName
// ) => {
//   const labels = []
//   if (filters.prefix) {
//     labels.push('In ' + idToName(filters.prefix))
//   }
//   if (filters.largest) {
//     labels.push(
//       getLang('FILTER_LARGEST_SELECTION', {
//         num: filters.largest,
//         region: getRegionLabel(region)
//       })
//     )
//   }
//   return labels.length > 0
//     ? labels.join(', ')
//     : getLang('PANEL_FILTER_NONE')
// }
