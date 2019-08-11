import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getValuePositionInRange } from '../../modules/config';
import { getLang } from '../../modules/lang';

/**
 * Get the transform for the marker
 */
const getTransform = (value, vertical = false) => {
  if (!value && value !== 0) {
    value = 0.5
  }
  return vertical ?
    `translateY(${100 - value*100}%)` :
    `translateX(${value*100}%)`
}

/**
 * Returns a CSS gradient string with the given colors
 * to match the provided value range and color distribution
 * range.
 * @param {*} param0 configuration for gradient string
 */
const getGradient = ({
  colors, 
  legendRange = [0,1], 
  colorRange = [0,1], 
  vertical = false
}) => {
  const legendExtent = legendRange[1] - legendRange[0]; // 6
  const colorExtent = colorRange[1] - colorRange[0]; // 7
  // size of the color range relative to the legend range
  const colorRangePercent = 100 * colorExtent / legendExtent; // 116.666%
  const steps = colors.length - 1;
  const colorStepSize = colorRangePercent / steps; // 16.666665714285714%
  const colorStartPercent = 100 *
    (colorRange[0] - legendRange[0]) / 
    (legendRange[1] - legendRange[0])
    // 100 * -1 / 6 = -16.6666%
  const colorStepsString = colors.map((c, i) =>  c + ' ' + 
    (colorStartPercent + (colorStepSize * i)) + '%'
  ).join(',')
  return vertical ?
    'linear-gradient(to top, ' + colorStepsString + ')' :
    'linear-gradient(to right, ' + colorStepsString + ')';
}

/**
 * Displays a gradient with start / end labels
 * @param {object} props 
 */
const LegendBar = ({ 
  title,
  startLabel, 
  endLabel,
  value,
  valueLangPrefix,
  colors, 
  vertical = false,
  legendRange = [0, 1],
  colorRange = [0, 1],
  className,
  invert = false,
  formatter,
}) => {
  const gradientString = 
    getGradient({colors, legendRange, colorRange, vertical})
  const markerPosition = value ? 
    getValuePositionInRange(value, legendRange, invert) :
    null
  const midPosition = getValuePositionInRange(
    (colorRange[1] + colorRange[0])/2, 
    legendRange
  )
  const midPercent = (midPosition * 100) + '%'
  return (
    <div 
      className={classNames(
        'legend-bar', 
        { 'legend-bar--vertical': vertical },
        { 'legend-bar--title': title },
        className,
      )}
    >
      {
        title && 
        <div className="legend-bar__title">
          {title}
        </div>
      }
      {
        startLabel && endLabel &&
          <div className="legend-bar__labels">
            <div className="legend-bar__label legend-bar__label--low">
              {startLabel}
            </div>
            <div className="legend-bar__label legend-bar__label--high">
              {endLabel}
            </div>
          </div>
      }
      

      <div className="legend-bar__values">
        <div className="legend-bar__value legend-bar__value--low">
          { valueLangPrefix ? 
              getLang(
                valueLangPrefix + 'LOW', 
                { value: formatter(legendRange[0]) }
              ) : formatter(legendRange[0])
          }
        </div>
        <div className="legend-bar__value legend-bar__value--zero"
          style={{
            position: 'absolute',
            left: vertical ? null : midPercent,
            bottom: vertical ? midPercent : null
          }}
        >
          { valueLangPrefix ? 
              getLang(
                valueLangPrefix + 'MID', 
                { value: formatter((colorRange[1] + colorRange[0])/2) }
              ) : formatter((colorRange[1] + colorRange[0])/2)
          }
        </div>
        <div className="legend-bar__value legend-bar__value--high">
          { valueLangPrefix ? 
              getLang(
                valueLangPrefix + 'HIGH', 
                { value: formatter(legendRange[1]) }
              ) : (formatter(legendRange[1]))
          }
        </div>
      </div>

      <div 
        className="legend-bar__gradient"
        style={{background: gradientString }}
      >
        <div 
          className={classNames(
            'legend-bar__marker',
            { 'legend-bar__marker--show': Boolean(markerPosition) }
          )}
          style={{
            transform: getTransform(markerPosition, vertical)
          }}
        >
          <span className='legend-bar__tick'>
            {formatter ? formatter(value) : value}
          </span>
        </div>
      </div>


    </div>
  )
}

LegendBar.propTypes = {
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  colors: PropTypes.array,
  vertical: PropTypes.bool,
  markerPosition: PropTypes.number,
  legendRange: PropTypes.array,
  colorRange: PropTypes.array,
  className: PropTypes.string,
}

export default LegendBar