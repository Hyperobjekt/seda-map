import React from 'react'
import { MapLegend } from '../../map'
import {
  getChoroplethColors,
  getMetricRangeFromVarName as getRange,
  getMetricIdFromVarName,
  getDemographicIdFromVarName,
  getFormatterForVarName,
  getGapDemographics,
  getInvertedFromVarName
} from '../app/selectors'
import {
  getPrefixLang,
  getDemographicLabel
} from '../app/selectors/lang'
import {
  useHovered,
  useRegion,
  useMarkersVisibility,
  useDemographicType,
  useCurrentVars
} from '../app/hooks'
import { getValuePositionInRange } from '../../../shared/utils'
import { useMapSize } from '../../map'
import { useLocationData } from '../location'

const SedaMapLegend = props => {
  /** variable to show on the map */
  const [, yVar] = useCurrentVars('map')
  /** id of the hovered location */
  const [hovered] = useHovered()
  /** boolean determining if hovered location should show */
  const [showHovered] = useMarkersVisibility()
  /** data for hovered id, if any */
  const hoveredData = useLocationData(hovered)
  /** boolean determining f the current demographic is a gap or not */
  const isGap = useDemographicType() === 'gap'
  /** current map region */
  const [region] = useRegion()
  /** width of the map viewport */
  const [width] = useMapSize()

  /** boolean determinng if the scale is inverted for the given var */
  const inverted = getInvertedFromVarName(yVar)
  /** metric id for the current map var */
  const metric = getMetricIdFromVarName(yVar)
  /** demographic id for the current map var */
  const demographic = getDemographicIdFromVarName(yVar)
  /** choroppleth colors for gradient (reversed if gap) */
  const colors = isGap
    ? [...getChoroplethColors()].reverse()
    : getChoroplethColors()
  /** range of values for start color to end color */
  const colorRange = getRange(yVar, region, 'map')
  /** range of values to label on min / max in the legend */
  const labelRange = getRange(yVar, region)
  /** number between 0 - 1 determining where the diverging point is on the scale */
  const midPosition = getValuePositionInRange(
    (colorRange[1] + colorRange[0]) / 2,
    labelRange
  )
  /** number between 0 - 1 that determines where the hovered location is on the scale */
  const markerPosition =
    showHovered && hoveredData
      ? getValuePositionInRange(
          hoveredData[yVar],
          labelRange,
          inverted
        )
      : null
  /** primary label for the map legend */
  const primary = getPrefixLang([demographic, metric], 'LABEL')

  /** array containing demographic labels (for gaps) */
  const dems = getGapDemographics(demographic).map(v =>
    getDemographicLabel(v)
  )
  /** prefix for the secondary map legend language */
  const secondaryPrefix = 'LEGEND_DESC' + (isGap ? '_GAP' : '')
  /** secondary label for the map legend */
  const secondary = getPrefixLang(metric, secondaryPrefix, dems)
  /** mid point label for the map legend */
  const midLabel = getPrefixLang(
    metric,
    'LEGEND_MID' + (isGap ? '_GAP' : '')
  )
  /** function to format min / max labels on the legend */
  const labelFormatter = getFormatterForVarName(yVar)

  return (
    <MapLegend
      layout={width < 500 ? 'vertical' : 'horizontal'}
      primary={primary}
      secondary={secondary}
      midLabel={midLabel}
      midPosition={midPosition}
      markerPosition={markerPosition}
      labelRange={labelRange}
      colorRange={colorRange}
      colors={colors}
      labelFormatter={labelFormatter}
      {...props}
    />
  )
}

export default SedaMapLegend
