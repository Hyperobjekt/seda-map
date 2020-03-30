import React from 'react'
import MapLegend from '../../map/components/MapLegend'
import {
  getChoroplethColors,
  getMetricRangeFromVarName as getRange,
  getMetricIdFromVarName,
  getDemographicIdFromVarName,
  getFormatterForVarName,
  getGapDemographics,
  getInvertedFromVarName
} from '../../../shared/selectors'
import {
  getPrefixLang,
  getDemographicLabel
} from '../../../shared/selectors/lang'
import useDataOptions from '../hooks/useDataOptions'
import { getValuePositionInRange } from '../../../shared/utils'
import useMapStore from '../hooks/useMapStore'
import useUiStore from '../hooks/useUiStore'

const SedaMapLegend = props => {
  /** variable to show on the map */
  const { yVar } = useDataOptions(state => state.getMapVars())
  /** id of the hovered location */
  const hovered = useUiStore(state => state.hovered)
  /** boolean determining if hovered location should show */
  const showHovered = useUiStore(state => state.showMarkers)
  /** function to grab the data for a given id  */
  const getData = useDataOptions(state => state.getDataForId)
  /** data for hovered id, if any */
  const hoveredData = hovered ? getData(hovered) : null
  /** boolean determining f the current demographic is a gap or not */
  const isGap = useDataOptions(state => state.isDemographicGap())
  /** boolean determinng if the scale is inverted for the given var */
  const inverted = getInvertedFromVarName(yVar)
  /** width of the map viewport */
  const width = useMapStore(state => state.viewport.width)
  /** metric id for the current map var */
  const metric = getMetricIdFromVarName(yVar)
  /** demographic id for the current map var */
  const demographic = getDemographicIdFromVarName(yVar)
  /** current map region */
  const region = useDataOptions(state => state.region)
  /** choroppleth colors for gradient (reversed if gap) */
  const colors = isGap
    ? [...getChoroplethColors()].reverse()
    : getChoroplethColors()
  /** range of values for start color to end color */
  const colorRange = getRange(yVar, region.id, 'map')
  /** range of values to label on min / max in the legend */
  const labelRange = getRange(yVar, region.id)
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
  const primary = getPrefixLang([metric, demographic], 'LABEL')

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
