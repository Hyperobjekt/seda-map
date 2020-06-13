import {
  SELECTED_COLORS,
  CHOROPLETH_COLORS,
  NO_DATA_COLOR
} from '../constants/colors'
import { interpolateRgbBasis } from 'd3-interpolate'
import { isGapVarName } from './demographics'
import { getMetricRangeFromVarName } from './data'
import { getValuePositionInRange } from '../../../shared/utils'

/**
 * Gets the configuration for selected colors
 */
export const getSelectedColors = () => SELECTED_COLORS

/**
 * Gets the configuration for choropleth colors
 */
export const getChoroplethColors = () => CHOROPLETH_COLORS

/** Checks if the varName has an inverted color scale */
export const isColorInvertedForVarName = varName => {
  return varName.indexOf('frl') > -1 || isGapVarName(varName)
}

/**
 * Gets a color in the range of choropleth colors based on value
 */
export const getChoroplethColorAtValue = interpolateRgbBasis(
  CHOROPLETH_COLORS
)

/**
 * Gets a color for a provided value and context
 * @param {*} value
 * @param {*} varName
 * @param {*} region
 * @param {*} type "map" or "chart"
 */
export const getColorForVarNameValue = (
  value,
  varName,
  region,
  type = 'map'
) => {
  if (!value && value !== 0) {
    return NO_DATA_COLOR
  }
  const range = getMetricRangeFromVarName(varName, region, type)
  const percent = getValuePositionInRange(value, range)

  return isColorInvertedForVarName(varName)
    ? getChoroplethColorAtValue(1 - percent)
    : getChoroplethColorAtValue(percent)
}
