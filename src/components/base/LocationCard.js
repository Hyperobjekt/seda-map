import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconButton } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { getLabel, getLang } from '../../constants/lang';

function LocationCard({
  active,
  order, 
  name, 
  state, 
  metrics, 
  feature,
  onDismiss,
  onHover,
  onClick
}) {
  const data = feature.properties;
  return (
    <div 
      className={
        classNames(
          'location-card', 
          { 'location-card--active': active }
        )
      }
      onMouseEnter={(e) => onHover(feature, e)}
      onMouseLeave={(e) => onHover(null, e)}
      onClick={(e) => onClick(feature, e)}
    >
      { 
        onDismiss &&
        <IconButton 
          className='location-card__close'
          onClick={(e) => { onDismiss(feature, e); e.stopPropagation(); }}
        >
          <Close fontSize='small' />
        </IconButton>
      }
      <div className='location-card__header'>
        <div className='location-card__marker'>
          <span className='location-card__marker-text'>
            {order}
          </span>
        </div>

        <div className="location-card__title">{name}</div>
        <div className='location-card__subtitle'>{state}</div>      
      </div>
      <div className='location-card__stats'>
        {
          metrics.map(k =>
            data[k] &&
            <div key={'stat_' + k} className='location-stat'>
              <div className='location-stat__label'>
                <span className='location-stat__primary-label'>
                  { getLabel(k.split('_')[1]) }
                </span>
                <span className='location-stat__secondary-label'>
                  { getLabel(k.split('_')[0]) } Students
                </span>
              </div>
              
              <span className='location-stat__value'>
                {data[k] && data[k] !== -9999 ? Math.round(data[k]*100)/100 : getLang('NO_DATA')}
              </span>
            </div>
          )
        }
      </div>
    </div>
  )
}

LocationCard.propTypes = {
  id: PropTypes.string,
  active: PropTypes.bool,
  name: PropTypes.string,
  state: PropTypes.string,
  metrics: PropTypes.array,
  feature: PropTypes.object,
  order: PropTypes.number,
  onDismiss: PropTypes.func,
  onClick: PropTypes.func,
  onHover: PropTypes.func
}

export default LocationCard

