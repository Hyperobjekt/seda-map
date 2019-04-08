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
 * Get the transform for the marker
 */
const getTransform = (value = 0, vertical = false) =>
  vertical ?
    `translateY(-${value*100}%)` :
    `translateX(${value*100}%)`

/**
 * Displays a gradient with start / end labels
 * @param {object} props 
 */
const GradientLegend = ({ startLabel, endLabel, markerPosition, colors, vertical = false}) => {
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
      >
        <div 
          className={classNames(
            'map-legend__marker',
            { 'map-legend__marker--show': Boolean(markerPosition) }
          )}
          style={{
            transform: getTransform(markerPosition, vertical)
          }}
        >
          <span className='map-legend__tick'></span>
        </div>
      </div>
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
  markerPosition: PropTypes.number
}

export default GradientLegend