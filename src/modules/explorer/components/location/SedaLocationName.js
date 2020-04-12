import React from 'react'
import PropTypes from 'prop-types'
import { LocationName } from '../base'
import {
  getSelectedColors,
  getRegionFromLocationId
} from '../../../../shared/selectors'
import {
  useLocationData,
  useLocationNumber,
  useRegion
} from '../../hooks'
import { getStateName } from '../../../../shared/selectors/states'

const selectedColors = getSelectedColors()

const SedaLocationName = ({ locationId, ...props }) => {
  console.log('location id', locationId)
  const locationData = useLocationData(locationId)
  const locationNumber = useLocationNumber(locationId)
  const [activeRegion] = useRegion()
  const featureRegion = getRegionFromLocationId(locationId)
  const color =
    activeRegion === featureRegion
      ? selectedColors[locationNumber - 1]
      : '#ccc'
  return (
    <LocationName
      name={locationData['name']}
      parentLocation={getStateName(locationId)}
      label={locationNumber}
      color={color}
      {...props}
    />
  )
}

SedaLocationName.propTypes = {
  locationId: PropTypes.string
}

export default SedaLocationName
