import React from 'react'
import PropTypes from 'prop-types'

export const ZoomToControl = ({ title, ...props }) => {
  return (
    <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
      <button
        className="mapboxgl-ctrl-icon mapboxgl-ctrl-us"
        title={title}
        {...props}
      />
    </div>
  )
}

ZoomToControl.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func
}

export default ZoomToControl
