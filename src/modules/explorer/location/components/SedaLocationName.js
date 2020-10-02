import React from 'react'
import PropTypes from 'prop-types'
import {
  getSelectedColors,
  getRegionFromLocationId
} from '../../app/selectors'
import { useRegion } from '../../app/hooks'
import { getStateName } from '../../../../shared/utils/states'
import useLocationData from '../hooks/useLocationData'
import useLocationNumber from '../hooks/useLocationNumber'
import LocationName from './LocationName'

const selectedColors = getSelectedColors()

const SedaLocationName = ({ locationId, ...props }) => {
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
