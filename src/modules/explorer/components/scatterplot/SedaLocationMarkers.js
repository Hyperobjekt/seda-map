import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core'
import {
  getCircles,
  getCircle
} from '../../../scatterplot/utils'
import ScatterplotMarker from '../../../scatterplot/components/ScatterplotMarker'
import { getColorForVarNameValue } from '../../../../shared/selectors'
import {
  useScatterplotVars,
  useHovered,
  useLocationsData,
  useLocationData,
  useRegion,
  useMarkersVisibility,
  useXyzTransformers
} from '../../hooks'
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
  const [region] = useRegion()
  const [showHovered] = useMarkersVisibility()
  const [xVar, yVar, zVar] = useScatterplotVars()
  const [hoveredId, setHovered] = useHovered()
  const hoveredData = useLocationData(hoveredId)
  const [xValToPos, yValToPos, zValToSize] = useXyzTransformers()
  const locations = useLocationsData()

  const locationIds = locations
    .filter(l => l.region === region)
    .map(l => l.id)
  const getLocationIndex = id =>
    locationIds.findIndex(l => l === id)

  // circles for selected areas
  const circles = getCircles({
    xVar,
    yVar,
    zVar,
    xValueToPercent: xValToPos,
    yValueToPercent: yValToPos,
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
      xValueToPercent: xValToPos,
      yValueToPercent: yValToPos,
      zValueToRadius: zValToSize,
      data: hoveredData
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
              region
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
