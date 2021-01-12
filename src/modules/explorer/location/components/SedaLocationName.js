import React from 'react'
import PropTypes from 'prop-types'
import useLocationData from '../hooks/useLocationData'
import LocationName from './LocationName'
import useLocationMarker from '../hooks/useLocationMarker'

const SedaLocationName = ({ locationId, ...props }) => {
  const locationData = useLocationData(locationId)
  const { number, color } = useLocationMarker(locationId)
  return locationData ? (
    <LocationName
      name={locationData.name}
      parentLocation={locationData.parentLocation}
      label={number === 0 ? '-' : number}
      color={color}
      {...props}
    />
  ) : null
}

SedaLocationName.propTypes = {
  locationId: PropTypes.string
}

export default SedaLocationName
