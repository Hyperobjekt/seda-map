import { 
  isGapDemographic, 
  getMetricIdFromVarName, 
  getDemographicIdFromVarName, 
  getFormatterForVarName
} from "./config";

import LANG from '../constants/en';


const isStringMatch = (s1, s2) =>
  s1 && s2 && (
    s1.toUpperCase() === s2.toUpperCase() ||
    s1 === '*' || s2 === '*'
  )

const isViewMatch = isStringMatch;
const isRegionMatch = isStringMatch;
const isMetricMatch = isStringMatch;
const isSecondaryMatch = isStringMatch;

const isDemographicMatch = (d1, d2) => (
  (d1 === 'gap' && isGapDemographic(d2)) ||
  (d2 === 'gap' && isGapDemographic(d1)) ||
  (d1 === 'nongap' && !isGapDemographic(d2)) ||
  (d2 === 'nongap' && !isGapDemographic(d1)) ||
  isStringMatch(d1, d2)
)

/**
 * Returns true if the provided key matches the region, 
 * demographic, and type passed
 */
const isKeyMatch = (
  key, 
  { 
    region, 
    demographic, 
    view, 
    metric, 
    secondary = 'ses'
  }
) => {
  if (key === '*') { return true; }
  const [
    contextId,
    viewId,
    regionId,
    metricId,
    secondaryId,
    demographicId
  ] = key.split('_');
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
export const hasLangKey = (key) =>
  LANG.hasOwnProperty(key.toUpperCase())

/**
 * Checks the LANG for any context-specific keys for
 * the provided values.
 */
export const populateContext = (values = {}, prefix) => {
  return Object.keys(values).reduce((obj, key) => ({
    ...obj,
    [key]: prefix && hasLangKey(prefix + '_' + values[key]) ? 
      getLang(prefix + '_' + values[key]) :
        hasLangKey('LABEL_' + values[key]) ? 
          getLang('LABEL_' + values[key]).toLowerCase() :
          values[key]
  }), {})
}

/**
 * Returns an array of paragraphs matching the provided context
 * @param {string} contextPrefix the prefix used in the LANG for this context
 * @param {object} contextValues the values for the current context
 */
export const getLanguageForContext = 
  (contextPrefix, contextValues) =>
    Object.keys(LANG)
      .filter(k => 
        k.startsWith(contextPrefix) && isKeyMatch(k, contextValues)
      )
      .map(k => getLang(k, populateContext(contextValues, contextPrefix)))

/**
 * Takes a text string and injects object keys that
 * match $[key]
 * @param {*} text 
 * @param {*} params 
 */
const interpolate = (text, params = {}) => {
  const arr = splitLang(text);
  return arr.map((a) => {
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
  }).join('')
}

/**
 * Gets the language string for the given key and data
 * @param {string} key 
 * @param {object} props 
 */
export const getLang = (key = '', props = {}) => {
  key = key.toUpperCase();
  if (!LANG[key]) { return key }
  return Object.keys(props).length > 0 ?
    interpolate(LANG[key], props) :
    LANG[key]
}

/**
 * Gets the label for the provided metric ID
 * @param {string} id 
 * @return {string}
 */
export const getLabel = (id) => {
  return getLang('LABEL_' + id.toUpperCase());
}

/** Split a lang string at the vars formatted as $[var] */
export const splitLang = (text) =>
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
      return value > 0 ? `VALUE_${metricId}_HIGH` :
        value < 0 ? `VALUE_${metricId}_LOW` : 
        value === 0 ? `VALUE_${metricId}_MID` : 'UNAVAILABLE'
    case 'grd':
      return value > 1 ? `VALUE_${metricId}_HIGH` :
        value < 1 ? `VALUE_${metricId}_LOW` : 
        value === 1 ? `VALUE_${metricId}_MID` : 'UNAVAILABLE'
    case 'ses':
      return value > 2.5 ? `VALUE_SES_ULTRA_HIGH` :
        value > 1.5 ? `VALUE_SES_VERY_HIGH` :
        value > 0.5 ? `VALUE_SES_HIGH` :
        value > -0.5 ? `VALUE_SES_MID` :
        value > -1.5 ? `VALUE_SES_LOW` :
        value > -2.5 ? `VALUE_SES_VERY_LOW` : `VALUE_SES_ULTRA_LOW`
    case 'frl':
      return 'VALUE_FRL'
    default:
      return 'DESCRIPTION_UNAVAILABLE'
  }
}

/**
 * Returns a description string given the provided variable and
 * value. 
 *    e.g. "Test scores are 1.34 levels above U.S. Average" is
 *          returned for `getDescriptionFromVarName('all_avg', 1.34)`
 */
export const getDescriptionForVarName = (varName, value) => {
  if ((!value || value === -9999) && value !== 0 ) { return ''; }
  const metricId = getMetricIdFromVarName(varName);
  const formatter = getFormatterForVarName(varName);
  const demographicId = getDemographicIdFromVarName(varName);
  const langKey = getDescriptionLangKey(metricId, value);
  const isGap = isGapDemographic(demographicId);
  const formattedValue = '' + formatter(value);
  if (!isGap) {
    return getLang(langKey, { 
      value: formattedValue[0] === '-' ? 
        formattedValue.substring(1) : formattedValue,
      students: getLang('LABEL_STUDENTS_' + demographicId)
    })
  }
  // gap demographic lang
  return getLang('VALUE_' + metricId + '_GAP', { 
    value: formattedValue,
    demographic: getLang('LABEL_SHORT_' + demographicId)
  })
  
  
}

/**
 * Returns string label for provided `varName`
 */
export const getLabelForVarName = (varName) => {
  const [ demographic, metric ] = varName.split('_');
  return getLang('LABEL_' + metric) + 
    (demographic !== 'all' ? ' (' + getLang('LABEL_' + demographic) + ')' : '');
}

/**
 * Returns array containing low / high labels for legend bar
 */
export const getLegendEndLabelsForVarName = (varName, langPrefix = 'LEGEND_') => {
  const [ demographic, metric ] = varName.split('_');
  const isGap = isGapDemographic(demographic);
  return isGap ? 
    [ getLang(`${langPrefix}LOW_${metric}_GAP`), getLang(`${langPrefix}HIGH_${metric}_GAP`) ] :
    [ getLang(`${langPrefix}LOW_${metric}`), getLang(`${langPrefix}HIGH_${metric}`) ]
}

/**
 * Get the label for the provided varnames and values
 * @param {*} values 
 */
export const getTooltipText = (values) => {
  const text = Object.keys(values).reduce((str, varName) => {
    return str + getDescriptionForVarName(varName, values[varName])
  }, '')
  return text !== '' ? text : getLang('DATA_UNAVAILABLE')
}