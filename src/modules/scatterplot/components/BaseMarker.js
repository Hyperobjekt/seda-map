import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';

const BaseMarker = ({ 
  type = 'circle', 
  className,
  color, 
  children,
  style = {},
  ...props 
}) => {
  return (
    <div 
      className={classNames("marker", {
        "marker--circle": type === 'circle',
        "marker--rect": type === 'rect',
        "marker--arrow": type === 'arrow',
      }, className)}
      style={{
        background: color,
        ...style
      }}
      {...props}
    >{children}</div>
  )
}

BaseMarker.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
}

export default BaseMarker