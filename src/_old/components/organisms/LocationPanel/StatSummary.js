import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import StatArrow from '../../molecules/StatArrow';

const StatSummary = ({
  label,
  value,
  color,
  description,
  formatter,
  valueToColor,
  valueToPosition,
}) => {
  return (
    <div className={classNames("stats-summary")}>
      { label && 
        <Typography variant="subtitle2" className="stats-summary__title">{label}</Typography>
      }
      <div className="stats-summary__content">
        <StatArrow 
          value={value}
          color={color}
          valueToColor={valueToColor}
          valueToPosition={valueToPosition}
          formatter={formatter}
        />
        { description  &&
          <Typography variant="body1"
            className="stats-summary__description" 
            dangerouslySetInnerHTML={{ '__html': description }} 
          />
        }
        
      </div>
    </div>
  )
}

StatSummary.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number
  ]),
  color: PropTypes.string,
  direction: PropTypes.string,
  description: PropTypes.string,
  formatter: PropTypes.func,
  valueToPosition: PropTypes.func,
  valueToColor: PropTypes.func,
}

export default StatSummary
