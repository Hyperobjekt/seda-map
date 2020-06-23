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
 * Returns if the provided object is a feature
 * @param {*} feature
 */
export const isFeature = feature => {
  return (
    feature &&
    typeof feature === 'object' &&
    feature.hasOwnProperty('properties')
  )
}

export const getFeatureFromArray = (features, id) => {
  return features.find(l => getFeatureProperty(l, 'id') === id)
}

/**
 * Gets the id of the hovered feature
 * @param {*} hovered
 */
export const getHoveredId = hovered =>
  hovered && hovered.properties && hovered.properties.id
    ? hovered.properties.id
    : ''

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
  getKeyMetrics,
  getSecondaryForDemographic
} from './metrics'
export {
  getRegionFromFeature,
  getRegionFromLocationId,
  getRegionById,
  getRegionDomain,
  getSingularRegion,
  getSingularRegions,
  getRegions,
  getLocationIdsForRegion,
  getSizesForRegion
} from './regions'
export {
  getPositionForVarNameValue,
  getPredictedValue,
  getFormatterForVarName,
  getMidpointForVarName,
  getMetricRangeFromVarName,
  getVarNames,
  getDataForId
} from './data'
export {
  getRegionLabel,
  getMetricLabel,
  getDemographicLabel,
  getLabelFromVarName,
  getLabelsFromVarNames
} from './lang'
