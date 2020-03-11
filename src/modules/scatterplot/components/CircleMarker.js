import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Marker from './BaseMarker'

const hasVal = val => val || val === 0

const CircleMarker = ({ className, x, y, size, color, children, ...props }) => {
  return hasVal(x) && hasVal(y) ? (
    <div
      className={classNames('marker__root', className)}
      style={{ transform: `translate(${x}, ${y})` }}>
      <Marker
        color={color}
        type="circle"
        style={{
          width: size + 'px',
          height: size + 'px',
          transform:
            'translate(' + (-1 * size) / 2 + 'px, ' + (-1 * size) / 2 + 'px)'
        }}
        {...props}>
        {children}
      </Marker>
    </div>
  ) : null
}

CircleMarker.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  x: PropTypes.string,
  y: PropTypes.string,
  size: PropTypes.number
}

export default CircleMarker
