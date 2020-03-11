import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  getFeatureProperty,
  getSelectedColors,
  getMetricRangeFromVarName,
  getSizerFunctionForRegion,
  getDemographicForVarNames
} from '../../../shared/selectors'
import CircleMarker from './CircleMarker'

const colors = getSelectedColors()
const MIN_OVERLAY_SIZE = 18

/**
 * Returns a percent based on where the value falls
 * within the range
 * @param {number} value
 * @param {array<number>} range
 */
const getPercentOfRange = (value, range, invert = false) => {
  const percent = ((value - range[0]) / (range[1] - range[0])) * 100
  return invert ? 100 - percent : percent
}

const hasVal = val => val || val === 0

/**
 * Returns object with position and size of a circle for a feature
 */
const getCircleForFeature = ({
  feature,
  xVar,
  yVar,
  zVar,
  xValueToPercent,
  yValueToPercent,
  zValueToRadius
}) => {
  if (!feature || !feature.properties) {
    return null
  }
  const xVal = getFeatureProperty(feature, xVar)
  const yVal = getFeatureProperty(feature, yVar)
  const zVal = getFeatureProperty(feature, zVar)
  return {
    id: feature.properties.id,
    x: xValueToPercent && hasVal(xVal) ? xValueToPercent(xVal) + '%' : null,
    y: yValueToPercent && hasVal(yVal) ? yValueToPercent(yVal) + '%' : null,
    z:
      zValueToRadius && hasVal(zVal)
        ? Math.max(MIN_OVERLAY_SIZE, zValueToRadius(feature.properties[zVar]))
        : MIN_OVERLAY_SIZE,
    data: feature
  }
}

/**
 * Returns an array of circle data for the provided features
 */
const getCircles = ({
  xVar,
  yVar,
  zVar,
  xValueToPercent,
  yValueToPercent,
  zValueToRadius,
  features,
  selected
}) => {
  if (!features) {
    return {}
  }
  // add circles for selected items
  return selected
    .map(id => (features[id] ? features[id] : null))
    .map(feature =>
      getCircleForFeature({
        feature,
        xVar,
        yVar,
        zVar,
        xValueToPercent,
        yValueToPercent,
        zValueToRadius
      })
    )
    .filter(f => f !== null)
}

/**
 * Returns if two features have the same id property
 */
const isSameFeature = (f1, f2) => {
  if (!f1 || !f2 || !f1.properties || !f2.properties) {
    return false
  }
  return f1.properties.id === f2.properties.id
}

/**
 * Returns if the provided hovered feature is in the
 * selected array
 */
const isHoveredSelected = (hovered, selected = []) => {
  if (!hovered || !hovered.properties) {
    return false
  }
  return selected.indexOf(hovered.properties.id) > -1
}

const ScatterplotOverlay = ({
  xVar,
  yVar,
  zVar,
  selected,
  region,
  features,
  hovered,
  invertX = false,
  onHover
}) => {
  // function that converts xValue to the % position on the scale
  const xValueToPercent = useMemo(
    () => val =>
      getPercentOfRange(val, getMetricRangeFromVarName(xVar, region), invertX),
    [xVar, region, invertX]
  )
  // function that converts yValue to the % position on the scale
  const yValueToPercent = useMemo(
    () => val =>
      100 - getPercentOfRange(val, getMetricRangeFromVarName(yVar, region)),
    [yVar, region]
  )
  // function that converts z value to circle radius in px
  const zValueToRadius = useMemo(() => {
    const sizerDem = getDemographicForVarNames(xVar, yVar)
    return getSizerFunctionForRegion(region, sizerDem)
  }, [region, xVar, yVar])
  // circles for selected areas
  const circles = useMemo(
    () =>
      getCircles({
        xVar,
        yVar,
        zVar,
        xValueToPercent,
        yValueToPercent,
        zValueToRadius,
        features,
        region,
        selected
      }),
    [
      xVar,
      yVar,
      zVar,
      selected,
      region,
      features,
      xValueToPercent,
      yValueToPercent,
      zValueToRadius
    ]
  )
  // circle for hovered feature
  const hoveredCircle =
    !isHoveredSelected(hovered, selected) &&
    getCircleForFeature({
      feature: hovered,
      xVar,
      yVar,
      zVar,
      xValueToPercent,
      yValueToPercent,
      zValueToRadius
    })

  return (
    <div className="location-markers">
      {circles.map((c, i) => (
        <CircleMarker
          key={'c' + i}
          color={
            isSameFeature(c.data, hovered) ? '#f00' : colors[i % colors.length]
          }
          size={c.z}
          x={c.x}
          y={c.y}
          onMouseEnter={e => {
            onHover(c.data, {}, e)
          }}
          onMouseLeave={e => {
            onHover(null, {}, e)
          }}>
          {i + 1}
        </CircleMarker>
      ))}
      {hoveredCircle && (
        <CircleMarker
          color="#f00"
          className={'marker__root--hover'}
          size={hoveredCircle.z}
          x={hoveredCircle.x}
          y={hoveredCircle.y}
        />
      )}
    </div>
  )
}

ScatterplotOverlay.propTypes = {
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  selected: PropTypes.array,
  region: PropTypes.string,
  features: PropTypes.object,
  hovered: PropTypes.object
}

export default ScatterplotOverlay
