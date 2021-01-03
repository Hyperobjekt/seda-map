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
  getColorRange,
  getKeyMetrics,
  getSecondaryForDemographic
} from './metrics'
export {
  getRegionFromFeature,
  getRegionFromLocationId,
  getRegionById,
  getSingularRegion,
  getSingularRegions,
  getRegions,
  getLocationIdsForRegion
} from './regions'
export {
  getPositionForVarNameValue,
  getPredictedValue,
  getFormatterForVarName,
  getMidpointForVarName,
  getColorRangeForVarName,
  getVarNames,
  getDataForId,
  isUnavailable
} from './data'
export {
  getRegionLabel,
  getMetricLabel,
  getDemographicLabel
} from './lang'
