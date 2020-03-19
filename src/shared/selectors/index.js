/**
 * Returns if the provided value is high, low, mid, or none
 * @param {*} value value for the provided metric
 * @param {*} metric the metric ID
 */
export const getHighLow = (value, metric) => {
  if (!value) {
    return 'NONE'
  }
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
 * Gets a property from a feature, returns null if not found
 * @param {Feature} feature GeoJSON feature
 * @param {string} propName property name to grab
 */
export const getFeatureProperty = (feature, propName) => {
  if (
    feature &&
    feature.properties &&
    feature.properties[propName] !== -999
  ) {
    return feature.properties[propName]
  }
  return null
}

/**
 * Gets the id of the hovered feature
 * @param {*} hovered
 */
export const getHoveredId = hovered =>
  hovered && hovered.properties && hovered.properties.id
    ? hovered.properties.id
    : ''

export { getMapVars } from './map'
export {
  getScatterplotVars,
  getSizerFunctionForRegion,
  getDotSize,
  getBaseVars
} from './scatterplot'
export {
  getColorForVarNameValue,
  isColorInvertedForVarName,
  getChoroplethColorAtValue,
  getChoroplethColors,
  getSelectedColors
} from './colors'
export {
  getDemographicForVarNames,
  getGapDemographics,
  getDemographicFromVarName,
  getDemographicIdFromVarName,
  isVersusFromVarNames,
  isGapVarName,
  isGapDemographic,
  getGapById,
  getDemographicById,
  getGaps,
  getDemographics
} from './demographics'
export {
  valueToLowMidHigh,
  getInvertedFromVarName,
  getMetricFromVarName,
  getMetricIdFromVarName,
  getMetricById,
  getMetrics,
  getMetricRange,
  getKeyMetrics
} from './metrics'
export {
  getRegionFromFeature,
  getRegionFromFeatureId,
  getRegionById,
  getRegionDomain,
  getSingularRegion,
  getSingularRegions,
  getRegions
} from './regions'
export {
  getPositionForVarNameValue,
  getPredictedValue,
  getFormatterForVarName,
  getMidpointForVarName,
  getMetricRangeFromVarName
} from './data'
export {
  getRegionLabel,
  getMetricLabel,
  getDemographicLabel,
  getLabelFromVarName,
  getLabelsFromVarNames
} from './lang'
