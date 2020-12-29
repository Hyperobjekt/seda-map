import React from 'react'
import IndicatorIcon from '../../../../../shared/components/Icons/IndicatorIcon'
import { LocationsIcon } from '../../../../icons'
import { useLocationCount } from '../../../location'
import SedaPanelButton from './SedaPanelButton'

export default function SedaLocationsPanelButton(props) {
  const locationCount = useLocationCount()
  return (
    <SedaPanelButton
      panelId="location"
      secondary={locationCount + ' pinned locations'}
      icon={
        <IndicatorIcon indicator={locationCount}>
          <LocationsIcon />
        </IndicatorIcon>
      }
      {...props}
    />
  )
}
