import React from 'react'
import { useTheme } from '@material-ui/core'
import {
  getCircles,
  getCircle,
  getValuePercentInRange
} from '../utils'
import {
  useHovered,
  useMarkersVisibility
} from '../../app/hooks'
import { getSizerFunctionForRegion } from '../selectors'
import {
  useLocationData,
  useCurrentRegionLocationsData
} from '../../location'
import { ScatterplotOverlay } from '../../../scatterplot'
import useScatterplotContext from '../hooks/useScatterplotContext'

/**
 * Provides functions for positioning and sizing
 * based on x, y, z values
 * @returns {[function, function, function]} [xValueToPercent, yValueToPercent, zValueToRadius]
 */
export const getXyzTransformers = (region, extents) => {
  const invertX = region === 'schools'
  const xRange = extents[0]
  const yRange = extents[1]
  // function that converts xValue to the % position on the scale
  const xValToPosition = val =>
    getValuePercentInRange(val, xRange, invertX)
  // function that converts yValue to the % position on the scale
  const yValToPosition = val =>
    100 - getValuePercentInRange(val, yRange)
  // function that converts z value to circle radius in px
  // const dem = getDemographicForVarNames(xVar, yVar)
  const zValToSize = getSizerFunctionForRegion({
    extent: extents[2]
  })
  // return transformers
  return [xValToPosition, yValToPosition, zValToSize]
}

const SedaLocationMarkers = ({ ...props }) => {
  const [showHovered] = useMarkersVisibility()
  const [hoveredId, setHovered] = useHovered()
  const hoveredData = useLocationData(hoveredId)
  const locations = useCurrentRegionLocationsData()
  const theme = useTheme()
  const {
    vars: [xVar, yVar, zVar],
    region,
    extents
  } = useScatterplotContext()
  const canRender = xVar && yVar && zVar && region

  // if props are not ready, don't render
  if (!canRender) return null

  const [xValToPos, yValToPos, zValToSize] = getXyzTransformers(
    region,
    extents
  )

  // base props for circles
  const circleProps = {
    xVar,
    yVar,
    zVar,
    region,
    xValueToPercent: xValToPos,
    yValueToPercent: yValToPos,
    zValueToRadius: zValToSize
  }

  // circles for selected locations
  const circles = getCircles({
    ...circleProps,
    data: locations
  })

  // circle for hovered location
  const hoveredCircle =
    hoveredId &&
    showHovered &&
    getCircle({
      ...circleProps,
      data: hoveredData
    })
  // set the hovered circle color from theme
  if (hoveredCircle)
    hoveredCircle['outerColor'] = theme.palette.secondary.main

  // handler for hover on circle
  const handleHover = (circle, e) => {
    const id = circle ? circle.id : null
    setHovered(id, [e.pageX, e.pageY])
  }

  return (
    <ScatterplotOverlay
      hoveredCircle={hoveredCircle}
      otherCircles={circles}
      onHover={handleHover}
      {...props}
    />
  )
}

export default SedaLocationMarkers
