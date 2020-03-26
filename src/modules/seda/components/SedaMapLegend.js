import React from 'react'
import PropTypes from 'prop-types'
import MapLegend from '../../map/components/MapLegend'
import {
  getChoroplethColors,
  getMetricRangeFromVarName as getRange,
  isVersusFromVarNames,
  getMapVars,
  getMetricIdFromVarName,
  getDemographicIdFromVarName,
  getFormatterForVarName,
  getGapDemographics,
  getInvertedFromVarName
} from '../../../shared/selectors'
import {
  getLang,
  getPrefixLang,
  getDemographicLabel
} from '../../../shared/selectors/lang'
import useDataOptions from '../hooks/useDataOptions'
import { getValuePositionInRange } from '../../../shared/utils'
import useMapStore from '../hooks/useMapStore'
import useUiStore from '../hooks/useUiStore'

const SedaMapLegend = props => {
  const { xVar, yVar } = useDataOptions(state =>
    state.getMapVars()
  )
  const hovered = useUiStore(state => state.hovered)
  const showHovered = useUiStore(state => state.showTooltip)
  const getDataForId = useDataOptions(
    state => state.getDataForId
  )
  const hoveredData = hovered ? getDataForId(hovered) : null
  const isGap = useDataOptions(state => state.isDemographicGap())
  const inverted = getInvertedFromVarName(yVar)
  const width = useMapStore(state => state.viewport.width)
  const metric = getMetricIdFromVarName(yVar)
  const demographic = getDemographicIdFromVarName(yVar)
  const region = useDataOptions(state => state.region)

  const colors = isGap
    ? [...getChoroplethColors()].reverse()
    : getChoroplethColors()
  const colorRange = getRange(yVar, region.id, 'map')
  const labelRange = getRange(yVar, region.id)

  const midPosition = getValuePositionInRange(
    (colorRange[1] + colorRange[0]) / 2,
    labelRange
  )

  const markerPosition =
    showHovered && hoveredData
      ? getValuePositionInRange(
          hoveredData[yVar],
          labelRange,
          inverted
        )
      : null

  // const theme = useTheme();
  // const isAboveMedium = useMediaQuery(theme.breakpoints.up('md'));

  // primary label
  const primaryPrefix = 'LEGEND_MAP' + (isGap ? '_GAP' : '')
  const primary = getPrefixLang([metric, demographic], 'LABEL')

  // secondary label
  const dems = getGapDemographics(demographic).map(v =>
    getDemographicLabel(v)
  )
  const secondaryPrefix = 'LEGEND_DESC' + (isGap ? '_GAP' : '')
  const secondary = getPrefixLang(metric, secondaryPrefix, dems)

  // mid label
  const midLabel = getPrefixLang(
    metric,
    'LEGEND_MID' + (isGap ? '_GAP' : '')
  )

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

SedaMapLegend.propTypes = {}

export default SedaMapLegend
