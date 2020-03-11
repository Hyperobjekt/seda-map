import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getCSSVariable, parseColor } from '../../shared/utils'

/**
 * Checks the lightness of the background color and
 * return if text should be dark or light
 */
const getForegroundColorFromBg = color => {
  if (!color) {
    return color
  }
  const [r, g, b] = parseColor(color)
  var yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'dark' : 'light'
}

const Arrow = ({ direction, color, className, ...props }) => {
  // get arrow color CSS variable
  const arrowColor = getCSSVariable(
    '--arrow-' + getForegroundColorFromBg(color)
  )
  return (
    <div
      className={classNames('arrow__root', className)}
      style={{ backgroundColor: color }}>
      <svg
        className="arrow__svg"
        viewBox="0 0 8 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        {direction ? (
          <path
            className="arrow__shape"
            d="M4 11L0 4H2.5L2.5 0H5.5L5.5 4H8L4 11Z"
            style={{
              transform: direction === 'up' ? 'rotate(180deg)' : 'rotate(0deg)',
              fill: arrowColor
            }}
          />
        ) : (
          <rect
            className="arrow__shape arrow__shape--null"
            width="6"
            height="2"
            x="1"
            y="5"
            fill={arrowColor}
          />
        )}
      </svg>
    </div>
  )
}

Arrow.propTypes = {
  direction: PropTypes.string,
  color: PropTypes.string
}

export default Arrow
