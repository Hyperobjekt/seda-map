import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Gets a CSS gradient string based on the provided colors
 * @param {array} colors 
 * @param {bool} vertical true if vertical gradient
 */
const getColorGradient = (colors, vertical = false) => {
  const colorString = colors.join(',');
  return vertical ?
    'linear-gradient(to top, ' + colorString + ')' :
    'linear-gradient(to right, ' + colorString + ')';
}

/**
 * Displays a gradient with start / end labels
 * @param {object} props 
 */
const GradientLegend = ({ startLabel, endLabel, colors, vertical = false}) => {
  if (!colors) { return <div />; }
  const gradientString = getColorGradient(colors, vertical)
  return (
    <div 
      className={classNames(
        'map-legend', 
        { 'map-legend--vertical': vertical }
      )}
    >
      <div className="map-legend__start-label">
        {startLabel}
      </div>
      <div 
        className="map-legend__gradient"
        style={{background: gradientString }}
      ></div>
      <div className="map-legend__end-label">
        {endLabel}
      </div>
    </div>
  )
}

GradientLegend.propTypes = {
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  colors: PropTypes.array.isRequired,
  vertical: PropTypes.bool,
}

export default GradientLegend