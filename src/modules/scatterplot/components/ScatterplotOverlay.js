import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  getFeatureProperty,
  getSelectedColors,
  getMetricRangeFromVarName,
  getSizerFunctionForRegion,
  getDemographicForVarNames
} from '../../../shared/selectors'
import CircleMarker from './ScatterplotMarker'

const colors = getSelectedColors()
const MIN_OVERLAY_SIZE = 18

const hasVal = val => val || val === 0

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
  data,
  xVar,
  yVar,
  zVar,
  region,
  hovered,
  invertX = false,
  onHover
}) => {
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
            isSameFeature(c.data, hovered)
              ? '#f00'
              : colors[i % colors.length]
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
