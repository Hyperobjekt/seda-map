import React from 'react';
import PropTypes from 'prop-types';

const ColorStops = ({ stops, vertical = false, label = false }) => (
  <div className={ 
    "color-stops" + (vertical ? ' color-stops--vertical' : '') 
  }>
    { stops && stops.map((s, i) =>
      <div 
        key={"color-stop" + i} 
        className="color-stops__stop"
        style={{ background: s[1] }}
      >
        {label && (i === 0 || i === stops.length - 1) &&
          <span>{s[0]}</span>
        }
      </div>
    )}
  </div>
)

ColorStops.propTypes = {
  stops: PropTypes.array.isRequired,
  vertical: PropTypes.bool,
  label: PropTypes.bool
}

export default ColorStops