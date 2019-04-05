import React from 'react'
import PropTypes from 'prop-types'

import { getStateName } from '../../constants/statesFips';
import LocationCard from './LocationCard';

function LocationCards({
  children,
  features = [], 
  metrics,
  onCardDismiss,
  onCardClick,
  onCardHover
}) {
  return (
    <div className='location-card-list'>
      { 
        Boolean(features.length) && features.map(
          (f, i) =>
            <LocationCard 
              key={'loc' + f.properties.id}
              id={f.properties.id}
              order={i+1}
              name={f.properties.name}
              state={getStateName(f.properties.id)}
              metrics={metrics}
              feature={f}
              onDismiss={onCardDismiss}
              onClick={onCardClick}
              onHover={onCardHover}
            />
        )
      }
      { children }
    </div> 
  )
}

LocationCards.propTypes = {
  children: PropTypes.node,
  features: PropTypes.array,
  metrics: PropTypes.array,
  onCardClick: PropTypes.func,
  onCardDismiss: PropTypes.func,
  onCardHover: PropTypes.func,
}

export default LocationCards

