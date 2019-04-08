import { 
  METRICS, 
  DEMOGRAPHICS, 
  GAPS, 
  REGIONS, 
  SELECTED_COLORS, 
  CHOROPLETH_COLORS, 
  BASE_VARS
} from '../constants/dataOptions';
import { underscoreSplit, getSingularRegion } from '../utils';
import { getStateSelectOptions } from '../constants/statesFips';


/**
 * Gets the configuration for base variables
 */
export const getBaseVars = () => BASE_VARS

/**
 * Gets the configuration for selected colors
 */
export const getSelectedColors = () => SELECTED_COLORS

/**
 * Gets the configuration for choropleth colors
 */
export const getChoroplethColors = () => CHOROPLETH_COLORS

/**
 * Gets the configuation for regions
 */
export const getRegions = () => REGIONS

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
 * Gets the metric object corresponding to the provided ID
 */
export const getMetricById = (id) =>
  METRICS.find(m => m.id === id)

/**
 * Gets the demographic object corresponding to the provided ID
 * @param {*} id 
 */
export const getDemographicById = (id) =>
  DEMOGRAPHICS.find(d => d.id === id)

/**
 * Gets the region object corresponding to the provided ID
 */
export const getRegionById = (id) =>
  REGIONS.find(r => r.id === id)

/**
 * Gets the label for the provided metric ID
 * @param {string} id 
 * @return {string}
 */
export const getMetricLabel = (id) => {
  let metric = METRICS.find(d => d.id === id);
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

/**
 * Gets the color stops for the provided metric ID
 * @param {string} id 
 * @returns {array}
 */
export const getStopsForMetric = (id) => {
  const metric = getMetricById(id)
  const colors = getChoroplethColors()
  const { min, max } = metric;
  const range = Math.abs(max - min);
  const stepSize = range / (colors.length);
  return colors.map((c, i) =>
    [ (min + (i * stepSize)), c ]
  )
}

/**
 * Gets the percent value of where the value sites on
 * the scale for the metric.
 * @param {*} value 
 * @param {*} metricId 
 * @returns {number} between 0 - 1
 */
export const getValuePositionForMetric = (value, metricId) => {
  const { min, max } = getMetricById(metricId);
  return Math.min(1, Math.max(0, (value - min) / (max - min)))
}

/**
 * Gets an object mapping metric ID to label
 * @param {array} metricIds an array of metric IDs
 * @param {string} demographic the demographic for the metrics
 */
export const getLabelsFromVarNames = (varNames) => {
  return varNames.reduce((labelCollection, varName) => {
    labelCollection[varName] = getLabelFromVarName(varName);
    return labelCollection;
  }, {})
}

/**
 * Gets expanded min / max of a metric by adding a provided
 * number of steps to each.
 * @param {string} metricId the metric to pad min / max values from
 * @param {int} padSteps the number of steps to expand the min / max
 */
export const getPaddedMinMax = (metricId, padSteps = 0) => {
  const m = getMetricById(metricId);
  const numSteps = getChoroplethColors().length-1
  let { min, max } = m;
  if (padSteps) {
    const stepSize = Math.abs(max - min) / numSteps;
    min = Math.round((min - (stepSize * padSteps))*10)/10;
    max = Math.round((max + (stepSize * padSteps))*10)/10;
  }
  return { min, max }
}

/**
 * Pads both sides of the provided stops by the given amount
 * @param {*} stops 
 * @param {*} amount 
 */
export const getPaddedStops = (stops, amount) => {
  const targetLength = (stops.length-1) + (amount*2)
  const newStops = [];
  for(var i = 0; i < targetLength; i++) {
    newStops[i] = (i >= (targetLength - stops.length + amount)) ?
      ((i <= stops.length - 1) ? stops[i] : stops[stops.length - 1])
      : stops[0]
  }
  return newStops
}

export const getLabelFromVarName = (varName) => {
  const [demId, metricId] = underscoreSplit(varName);
  return getMetricLabel(metricId) 
    + ' (' + getDemographicLabel(demId) + ')'
}

export const getMetricIdFromVarName = (varName) =>
  varName.split('_')[1]

export const getDemographicIdFromVarName = (varName) =>
  varName.split('_')[0]


export const getMetricControl = (metric, id = 'metric') => ({
  id,
  label: 'Data Metric',
  value: metric,
  hint: 'press to change between average, growth, or trend in test scores of students in grades 3 - 8 from 2009 - 2016',
  options: getMetrics()
    .filter(m => ['avg', 'grd', 'coh'].indexOf(m.id) > -1)
})

export const getSecondaryMetricControl = (metric, id = 'metric') => ({
  id,
  label: 'Data Metric',
  value: metric,
  hint: 'press to change between average, growth, or trend in test scores of students in grades 3 - 8 from 2009 - 2016',
  options: getMetrics()
    .filter(m => ['ses', 'seg'].indexOf(m.id) > -1)
})

export const getRegionControl = (region, id = 'region') => ({
  id,
  label: 'Region',
  value: region,
  options: getRegions(),
  hint: 'press to change between counties, school districts, or schools',
  formatter: (option) => getSingularRegion(option.id)
})

export const getDemographicControl = (
  demographic, 
  id = 'demographic', 
  label = 'Demographics'
) => ({
  id,
  label,
  value: demographic,
  options: getDemographics(),
  hint: 'press to select a demographic or gap ',
  formatter: (option) => option.label + ' students'
})

export const getHighlightControl = (highlight) => ({
  id: 'highlight',
  label: 'Highlight',
  value: highlight ? highlight : 'us',
  options: [
    {
      id: 'us',
      label: 'U.S.'
    },
    ...getStateSelectOptions()
  ]
})

export const getGapControl = (gap) => ({
  id: 'gap',
  label: 'Gap Type',
  value: gap,
  options: getGaps()
})


/**
 * Get the label for the provided metric and value
 * @param {*} metric 
 * @param {*} value 
 */
export const getMetricTooltip = (metric, value) => {
  if (!value || value <= -9999) { return 'Data unavailable' }
  switch (metric) {
    case 'avg':
      return `Students score ${Math.round(Math.abs(value)*100)/100} grade levels 
        ${value > 0 ? 'above' : 'below'} average`;
    case 'grd':
      return `Students grow ${Math.round(value*100)/100} grade levels each year`;
    case 'coh':
      return `Test scores ${value > 0 ? 'raising' : 'falling'} ${Math.round(Math.abs(value)*100)/100} 
        grade levels over time`;
    default:
      throw new Error(`no label for ${metric}`)
  }
}