import React from 'react'
import { MapLegend } from '../../map'
import {
  getChoroplethColors,
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
  useMarkersVisibility,
  useDemographicType,
  useAppContext
} from '../app/hooks'
import { getValuePositionInRange } from '../../../shared/utils'
import { useMapSize } from '../../map'
import { useLocationData } from '../location'
import { withStyles } from '@material-ui/core'

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      borderRadius:0,
      boxShadow: `0 1px 0 rgba(0,0,0,0.1)`
    }
  }
})

const SedaMapLegend = props => {
  /** id of the hovered location */
  const [hovered] = useHovered()
  /** boolean determining if hovered location should show */
  const [showHovered] = useMarkersVisibility()
  /** data for hovered id, if any */
  const hoveredData = useLocationData(hovered)
  /** boolean determining f the current demographic is a gap or not */
  const isGap = useDemographicType() === 'gap'
  /** width of the map viewport */
  const [width] = useMapSize()
  /** pull color extent and map y var from app context */
  const {
    colorExtent,
    mapVars: [, yVar],
    metric,
    demographic,
    region
  } = useAppContext()
  /** boolean determinng if the scale is inverted for the given var */
  const inverted = getInvertedFromVarName(yVar)
  /** choroppleth colors for gradient (reversed if gap) */
  const colors = isGap
    ? [...getChoroplethColors()].reverse()
    : getChoroplethColors()
  /** range of values to label on min / max in the legend */
  const labelRange = colorExtent
  /** number between 0 - 1 determining where the diverging point is on the scale */
  const midPosition = getValuePositionInRange(
    (colorExtent[1] + colorExtent[0]) / 2,
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
  const secondary = getPrefixLang(metric, secondaryPrefix, [...dems, region])
  /** mid point label for the map legend */
  const midLabel = getPrefixLang(
    metric,
    'LEGEND_MID' + (isGap ? '_GAP' : '')
  )
  /** function to format min / max labels on the legend */
  const labelFormatter = getFormatterForVarName(yVar)

  return (
    <MapLegend
      layout={width < 600 ? 'vertical' : 'horizontal'}
      primary={primary + ' by ' + getPrefixLang(region, 'LABEL_SINGULAR')}
      secondary={secondary}
      midLabel={midLabel}
      midPosition={midPosition}
      markerPosition={markerPosition}
      labelRange={labelRange}
      colorRange={colorExtent}
      colors={colors}
      labelFormatter={labelFormatter}
      {...props}
    />
  )
}

export default withStyles(styles)(SedaMapLegend)
