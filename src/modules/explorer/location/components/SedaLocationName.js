import React from 'react'
import PropTypes from 'prop-types'
import {
  getSelectedColors,
  getRegionFromLocationId
} from '../../app/selectors'
import { useRegion } from '../../app/hooks'
import { getStateName } from '../../../../shared/utils/states'
import { LocationName } from '../../app/components/base'
import useLocationData from '../hooks/useLocationData'
import useLocationNumber from '../hooks/useLocationNumber'

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
