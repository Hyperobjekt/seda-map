import React, { useMemo } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core'
import useDataOptions from '../../hooks/useDataOptions'
import useUiStore from '../../hooks/useUiStore'
import {
  getCircles,
  getCircle
} from '../../../scatterplot/utils'
import ScatterplotMarker from '../../../scatterplot/components/ScatterplotMarker'
import { getColorForVarNameValue } from '../../../../shared/selectors'
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: 24,
    right: 64,
    top: 24,
    bottom: 24,
    pointerEvents: 'none'
  },
  hoverMarker: {
    pointerEvents: 'none'
  }
}))

const SedaLocationMarkers = ({ ...props }) => {
  const region = useDataOptions(state => state.region)
  const locationIds = useDataOptions(state =>
    state.getLocationIdsForRegion()
  )
  const showHovered = useUiStore(state => state.showTooltip)
  const hoveredId = useUiStore(state => state.hovered)
  const getDataForId = useDataOptions(
    state => state.getDataForId
  )
  const locations = locationIds.map(id => getDataForId(id))
  const { xVar, yVar, zVar } = useDataOptions(state =>
    state.getScatterplotVars()
  )
  const setHovered = useUiStore(state => state.setHovered)
  const {
    xValToPosition,
    yValToPosition,
    zValToSize
  } = useDataOptions(state => state.getXyzTransformers())
  // circles for selected areas
  const circles = getCircles({
    xVar,
    yVar,
    zVar,
    xValueToPercent: xValToPosition,
    yValueToPercent: yValToPosition,
    zValueToRadius: zValToSize,
    data: locations
  })
  const hoveredCircle =
    hoveredId &&
    showHovered &&
    getCircle({
      xVar,
      yVar,
      zVar,
      xValueToPercent: xValToPosition,
      yValueToPercent: yValToPosition,
      zValueToRadius: zValToSize,
      data: getDataForId(hoveredId)
    })
  const classes = useStyles()
  const theme = useTheme()
  return (
    <div className={clsx('scatterplot__markers', classes.root)}>
      {hoveredCircle && (
        <ScatterplotMarker
          x={hoveredCircle.x}
          y={hoveredCircle.y}
          size={hoveredCircle.z}
          color={theme.palette.secondary.main}
          classes={{ marker: classes.hoverMarker }}
        />
      )}
      {circles.map((c, i) => (
        <ScatterplotMarker
          key={c.id}
          x={c.x}
          y={c.y}
          size={c.z}
          label={i + 1}
          color={theme.app.selectedColors[i]}
          innerColor={getColorForVarNameValue(
            c.data[yVar],
            yVar,
            region.id
          )}
          onMouseMove={e => setHovered(c.id, [e.pageX, e.pageY])}
          onMouseLeave={e => setHovered(null)}
        />
      ))}
    </div>
  )
}

export default SedaLocationMarkers
