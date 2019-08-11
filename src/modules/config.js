import { 
  METRICS, 
  DEMOGRAPHICS, 
  GAPS, 
  REGIONS, 
  SELECTED_COLORS, 
  CHOROPLETH_COLORS, 
  BASE_VARS,
  MAP_ID_LENGTH_TO_REGION,
  MAX_LOCATIONS,
  NO_DATA_COLOR,
  REGION_DOMAINS,
  DOT_SIZES,
  FUNC_VARS
} from '../constants/dataOptions';
import * as scale from 'd3-scale';
import { interpolateRgbBasis } from 'd3-interpolate';
import { getPositionFromValue, formatPercentDiff, formatPercent, formatNumber } from '../utils';

/**
 * Gets the configuration for base variables
 */
export const getBaseVars = () => BASE_VARS

export const getDotSize = () => DOT_SIZES

/**
 * Gets the configuration for selected colors
 */
export const getSelectedColors = () => SELECTED_COLORS

/**
 * Gets the configuration for choropleth colors
 */
export const getChoroplethColors = () => CHOROPLETH_COLORS

export const getChoroplethColorAtValue = interpolateRgbBasis(CHOROPLETH_COLORS)

export const getColorStep = (stepNum) => getChoroplethColors()[stepNum]



/**
 * Gets the configuation for regions
 */
export const getRegions = () => REGIONS

export const getSingularRegions = () => 
  REGIONS.map(r => ({id: r.id, label: r.singular}))

export const getSingularRegion = (rId) => 
  rId ? REGIONS.find(r => rId === r.id).singular : ''


export const getRegionDomain = (demographic, region) => 
  region === 'schools' ? 
    REGION_DOMAINS['schools'] :
    REGION_DOMAINS[demographic + '_' + region]

/**
 * Gets the configuration for demographics
 */
export const getDemographics = () => DEMOGRAPHICS

/**
 * Gets the configuration for metrics
 */
export const getMetrics = () => METRICS

/**
 * Gets the configuration for gaps
 */
export const getGaps = () => GAPS

/**
 * Gets the maximum number of locations
 */
export const getMaxLocations = () => MAX_LOCATIONS

/**
 * Gets the metric object corresponding to the provided ID
 */
export const getMetricById = (id) =>
  getMetrics().find(m => m.id === id)

/**
 * Gets the demographic object corresponding to the provided ID
 * @param {*} id 
 */
export const getDemographicById = (id) =>
  getDemographics().find(d => d.id === id)

/**
 * Gets the region object corresponding to the provided ID
 */
export const getRegionById = (id) =>
  getRegions().find(r => r.id === id)

/**
 * Gets the region object corresponding to the provided ID
 */
export const getGapById = (id) =>
  getGaps().find(r => r.id === id)

/**
 * Gets the label for the provided metric ID
 * @param {string} id 
 * @return {string}
 */
export const getMetricLabel = (id) => {
  let metric = getMetrics().find(d => d.id === id);
  if (!metric) {
    throw new Error('no metric found for ' + id)
  }
  return metric.label;
}

/**
 * Gets the label for the provided demographic ID
 * @param {string} id 
 * @returns {string}
 */
export const getDemographicLabel = (id) => {
  let dem = DEMOGRAPHICS.find(d => d.id === id);
  if (!dem) {
    dem = GAPS.find(d => d.id === id)
  }
  if (!dem) {
    throw new Error('no demographic found for ' + id)
  }
  return dem.label;
}

/**
 * Gets the label for the provided region ID
 * @param {string} id 
 * @returns {string}
 */
export const getRegionLabel = (id) => {
  let region = REGIONS.find(r => r.id === id);
  if (!region) {
    throw new Error('no region found for ' + id)
  }
  return region.label;
}

export const intToRegionId = (value, region) => {
  const s = "0000000000000" + value;
  const length = Object.keys(MAP_ID_LENGTH_TO_REGION)
    .find(k => MAP_ID_LENGTH_TO_REGION[k] === region)
  if (length) {
    return s.substr(s.length - parseInt(length));
  }
  throw new Error('no id length for region ' + region)
}

/**
 * Gets the region that corresponds to the provided ID
 * @param {string} id 
 */
export const getRegionFromFeatureId = (id) => {
  if (!id) { return null; }
  if (!MAP_ID_LENGTH_TO_REGION[id.length]) {
    throw new Error('No region corresponding to provided ID');
  }
  return MAP_ID_LENGTH_TO_REGION[id.length]
}

/**
 * Gets the region that corresponds to the provided ID
 * @param {string} id 
 */
export const getRegionFromFeature = (feature) => {
  if (!feature || !feature.properties) { return null; }
  return getRegionFromFeatureId(feature.properties.id);
}

/**
 * Returns true if the demographic id represents a gap
 */
export const isGapDemographic = (id) => {
  return Boolean(getGapById(id))
}


export const getValuePositionInRange = (value, range, invert = false) => {
  const [ min, max ] = range
  const pos = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return invert ? (1 - pos) : pos;
}

/**
 * Returns true if the provided key matches the region, 
 * demographic, and type passed
 */
const isRangeKeyMatch = (key, { region, demographic, type }) => {
  if (key === '*') { return true; }
  const [t, r, d = false ] = key.split('_');
  return (t === '*' || t === type) &&
    (r === '*' || r === region) &&
    (
      d === '*' || 
      d === demographic || 
      (d === 'gap' && isGapDemographic(demographic)) ||
      !d
    );
}

/**
 * gets the range for the metric, or an alternate range
 * if a variant is specified
 * @param {string} id metric id
 * @param {string} demographic demographic to get the range for
 * @param {string} region region to get the range for
 * @param {string} type type of range, if using separate map / chart ranges (e.g. 'map') 
 */
export const getMetricRange = (id, demographic, region, type = '') => {
  const metric = getMetricById(id)
  if (!metric || !metric.range ) {
    throw new Error(`no range specified for metric ${id}`)
  }
  const rangeKey = 
    Object.keys(metric.range)
      .find(k => isRangeKeyMatch(k, { demographic, region, type }))
  return rangeKey && metric.range[rangeKey] ? metric.range[rangeKey] : null
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
  return scale.scalePow()
    .exponent(exponent)
    .domain(getRegionDomain(demographic, region))
    .range(range)
    .clamp(true);
}

/**
 * Returns if the provided value is high, low, mid, or none
 * @param {*} value value for the provided metric
 * @param {*} metric the metric ID
 */
export const getHighLow = (value, metric) => {
  if (!value) { return 'NONE'; }
  switch (metric) {
    case 'avg':
      return value > 0.3 ? 'HIGH' : value < -0.3 ? 'LOW' : 'MID'
    case 'coh':
      return value > 0.1 ? 'HIGH' : value < -0.1 ? 'LOW' : 'MID'
    case 'grd':
      return value > 1.09 ? 'HIGH' : value < 0.91 ? 'LOW' : 'MID'
    default:
      return ''
  }
}

/**
 * Gets the vars for the map section
 */
export const getMapVars = (region, metric, demographic) => {
  if (region === 'schools') {
    return {
      yVar: 'all_' + metric,
      xVar: 'all_frl',
      zVar: 'all_sz',
    }
  }
  const useAll = ['m', 'f', 'p', 'np'].indexOf(demographic) > -1;
  return {
    yVar: demographic + '_' + metric,
    xVar: useAll ? 'all_ses' : demographic + '_ses',
    zVar: demographic + '_sz'
  }
}

/**
 * Gets the variables for the chart section
 * @param {string} region 
 * @param {string} metric 
 * @param {string} demographic 
 */
export const getScatterplotVars = (region, metric, demographic) => {
  if (region === 'schools') {
    return {
      yVar: 'all_' + metric,
      xVar: 'all_frl',
      zVar: 'all_sz',
    }
  }
  if (isGapDemographic(demographic)) {
    let dem1 = demographic[0];
    
    let dem2 = demographic[1];
    // if poor / non-poor, get correct demographic and order
    if (dem2 === 'n') {
      dem1 = 'np';
      dem2 = 'p';
    }
    return {
      yVar: dem2 + '_' + metric,
      xVar: dem1 + '_' + metric,
      zVar: demographic + '_sz'
    }
  }
  const useAll = ['m', 'f', 'p', 'np'].indexOf(demographic) > -1;
  return {
    yVar: demographic + '_' + metric,
    xVar: useAll ? 'all_ses' : demographic + '_ses',
    zVar: demographic + '_sz'
  }
}


/**
 * **********************
 * VARNAME SELECTORS
 * **********************
 */

export const getColorForVarNameValue = (value, varName, region, type = 'map') => {
  if (!value) { return NO_DATA_COLOR; }
  const percent  = getValuePositionForVarName(value, varName, region, type)
  return varName.indexOf('frl') > -1 ? 
    getChoroplethColorAtValue(1-percent) :
    getChoroplethColorAtValue(percent)
}

/**
 * Returns true if the variable name (e.g. wb_avg) represents a gap
 * @param {*} varName 
 */
export const isGapVarName = (varName) => {
  const id = getDemographicIdFromVarName(varName)
  return Boolean(getGapById(id))
}

export const isVersusFromVarNames = (xVar, yVar) =>
  xVar.split('_')[1] === yVar.split('_')[1]

/**
 * Returns an array containing the min and max for the
 * provided varname and region
 */
export const getMetricRangeFromVarName = (varName, region, type) => {
  const metricId = getMetricIdFromVarName(varName)
  const demId = getDemographicIdFromVarName(varName)
  return getMetricRange(metricId, demId, region, type);
}

/**
 * Returns the diverging midpoint for the provided varName
 * @param {string} varName 
 */
export const getMidpointForVarName = (varName) => {
  if (varName.split('_')[1] === 'grd' && !isGapVarName(varName)) {
    return 1;
  }
  // set midpoint out of view for FRL
  if (varName.split('_')[1] === 'frl') { 
    return -10
  }
  return 0;
}


/**
 * Gets the position of where the bar should extend to 
 * for a value based on the metric
 * @param {string} varName 
 * @param {number} value 
 * @param {array} range 
 */
export const getPositionForVarNameValue = (varName, value, range) => {
  const midPoint = getMidpointForVarName(varName);
  return varName.indexOf('frl') > -1 ?
    getValuePositionInRange(value, range) :
    getPositionFromValue(value, range, midPoint)
}

/**
 * Gets an object mapping of variable name to label
 * @param {array} varNames an array of variable names
 */
export const getLabelsFromVarNames = (varNames) => {
  return varNames.reduce((labelCollection, varName) => {
    labelCollection[varName] = getLabelFromVarName(varName);
    return labelCollection;
  }, {})
}

/**
 * Returns a string with the label for the given variable name, in
 * the format {METRIC_LABEL} ({DEMOGRAPHIC_LABEL})
 * @param {*} varName 
 */
export const getLabelFromVarName = (varName) => {
  const [demId, metricId] = varName.split('_');
  return getMetricLabel(metricId) 
    + ' (' + getDemographicLabel(demId) + ')'
}

/**
 * Returns the metric id portion of the variable name
 */
export const getMetricIdFromVarName = (varName) =>
  typeof varName === 'string' ? varName.split('_')[1] : null

/**
 * Returns the metric object that corresponds to the metric
 * id in the variable name.
 * @param {string} varName 
 */
export const getMetricFromVarName = (varName) =>
  getMetricById(getMetricIdFromVarName(varName))

/**
 * Returns the demographic id portion of the variable name
 */
export const getDemographicIdFromVarName = (varName) =>
  varName.split('_')[0]

/**
 * Returns the demographic object that corresponds to the demographic
 * id in the variable name.
 * @param {string} varName 
 */
export const getDemographicFromVarName = (varName) => {
  const id = getDemographicIdFromVarName(varName)
  const dem = getDemographicById(id);
  return dem ? dem : getGapById(id)
}

/**
 * Gets the percent value of where the value sites on
 * the scale for the metric.
 * @param {*} value 
 * @param {*} varName 
 * @returns {number} between 0 - 1
 */
export const getValuePositionForVarName = (value, varName, region, type) => {
  if (!value && value !== 0) { return null; }
  return getValuePositionInRange(
    value,
    getMetricRangeFromVarName(varName, region, type)
  )
}

/**
 * Returns a function to format values for the provided varName
 * @param {*} varName 
 */
export const getFormatterForVarName = (varName) => {
  const metric = getMetricIdFromVarName(varName);
  const isGap = isGapVarName(varName);

  if (isGap) { return formatNumber }
  switch(metric) {
    case 'grd':
      return formatPercentDiff
    case 'frl':
      return formatPercent
    default:
      return formatNumber
  }
}

export const getInvertedFromVarName = (varName) =>
  (varName.includes('frl'))

/** Returns a single demographic for the provided varNames */
export const getDemographicForVarNames = (xVar, yVar) => {
  const dem1 = getDemographicIdFromVarName(xVar);
  const dem2 = getDemographicIdFromVarName(yVar);
  // same dem for x and y
  if (dem1 === dem2) { return dem1; }
  // all on X, but different on Y
  if (dem1 === 'all') { return dem2; }
  
  // two different dems on x and y, must be gap
  
  // special case for poor / non-poor gap
  if (
    (dem1 === 'p' && dem2 === 'np') ||
    (dem1 === 'np' && dem2 === 'p') ||
    (dem1 === 'np' && dem2 === 'pn')
  ) { return 'pn'}
  // return default gap
  return dem1+dem2;
}

export const getPredictedValue = (value, metric, region) => {
  const b = FUNC_VARS[region][metric];
  return b[0] + 
    b[1]*value + 
    b[2]*Math.pow(value,2) + 
    b[3]*Math.pow(value,3);
}

export const valueToLowMidHigh = (metricId, value) => {
  if (!value && value !== 0) { return 'NONE'; }
  return metricId === 'grd' ?
    (value > 1 ? 'HIGH' : (value < 1 ? 'LOW' : 'MID')) :
    (value > 0 ? 'HIGH' : (value < 0 ? 'LOW' : 'MID')) 
}