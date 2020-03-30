import React from 'react'
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none'
  },
  hoverMarker: {
    pointerEvents: 'none'
  }
}))

const SedaLocationMarkers = ({ className, ...props }) => {
  const region = useDataOptions(state => state.region)
  const locationIds = useDataOptions(state =>
    state.getLocationIdsForRegion()
  )
  const showHovered = useUiStore(state => state.showMarkers)
  /** TODO: put hovered into its own component to cut down rerenders */
  const hoveredId = useUiStore(state => state.hovered)
  const getDataForId = useDataOptions(
    state => state.getDataForId
  )
  const { xVar, yVar, zVar } = useDataOptions(state =>
    state.getScatterplotVars()
  )
  const setHovered = useUiStore(state => state.setHovered)
  const {
    xValToPosition,
    yValToPosition,
    zValToSize
  } = useDataOptions(state => state.getXyzTransformers())

  const getLocationIndex = id =>
    locationIds.findIndex(l => l === id)

  const locations = locationIds.map(id => getDataForId(id))

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
    <div
      className={clsx(
        'scatterplot__markers',
        classes.root,
        className
      )}
      {...props}>
      {hoveredCircle && (
        <ScatterplotMarker
          x={hoveredCircle.x}
          y={hoveredCircle.y}
          size={hoveredCircle.z}
          zIndex={10}
          color={theme.palette.secondary.main}
          classes={{ marker: classes.hoverMarker }}
        />
      )}
      {circles
        .sort((a, b) => (a.z > b.z ? -1 : 1))
        .map((c, i) => (
          <ScatterplotMarker
            key={c.id}
            x={c.x}
            y={c.y}
            size={c.z}
            label={getLocationIndex(c.id) + 1}
            zIndex={i + 1}
            color={
              theme.app.selectedColors[getLocationIndex(c.id)]
            }
            innerColor={getColorForVarNameValue(
              c.data[yVar],
              yVar,
              region.id
            )}
            onMouseMove={e =>
              setHovered(c.id, [e.pageX, e.pageY])
            }
            onMouseLeave={e => setHovered(null)}
          />
        ))}
    </div>
  )
}

export default SedaLocationMarkers
