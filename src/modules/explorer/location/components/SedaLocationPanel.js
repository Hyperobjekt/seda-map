import React from 'react'
import { IconButton } from '@material-ui/core'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../shared'
import {
  getDemographics,
  getGaps,
  getRegionFromLocationId
} from '../../app/selectors'
import { CloseIcon } from '../../../icons'
import { useMetric, useDemographic } from '../../app/hooks'
import { SedaLocationName } from '..'
import useActiveLocationData from '../hooks/useActiveLocationData'
import useActiveLocation from '../hooks/useActiveLocation'
import LocationTable from './LocationTable'

/**
 * Gets available demographics for region
 * @param {*} region
 */
const getDemographicsForRegion = region => {
  return region === 'schools'
    ? ['all']
    : getDemographics().map(d => d.id)
}

/**
 * Gets the secondary metrics for the region
 * @param {*} region
 */
const getSecondaryMetricsForRegion = region => {
  return region === 'schools' ? ['frl'] : ['ses', 'seg', 'min']
}

/**
 * Gets available gaps for region
 * @param {*} region
 */
const getGapsForRegion = region => {
  return region === 'schools' ? [] : getGaps().map(d => d.id)
}

const SedaLocationPanel = props => {
  const data = useActiveLocationData()
  const [activeLocation, setActiveLocation] = useActiveLocation()
  const [metric, setMetric] = useMetric()
  const [demographic, setDemographic] = useDemographic()
  const region = getRegionFromLocationId(activeLocation)
  const secondary = getSecondaryMetricsForRegion(region)

  const metrics = ['avg', 'grd', 'coh']
  const demographics = getDemographicsForRegion(region)
  const gaps = getGapsForRegion(region)

  const handleMetricSelect = e => {
    setMetric(e.currentTarget.value)
  }
  const handleDemographicSelect = e => {
    setDemographic(e.currentTarget.value)
  }
  console.log(data)
  // TODO: better handling when data isn't ready yet
  return data ? (
    <SidePanel {...props}>
      <SidePanelHeader sticky>
        {data['id'] && (
          <SedaLocationName locationId={data['id']} />
        )}
        <IconButton onClick={() => setActiveLocation(null)}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody>
        <LocationTable
          data={data}
          label={'Subgroups'}
          metrics={metrics}
          demographics={demographics}
          activeMetric={metric}
          activeDemographic={demographic}
          labelPrefix="LABEL_STUDENTS"
          onMetricSelect={handleMetricSelect}
          onDemographicSelect={handleDemographicSelect}
        />
        {gaps.length > 0 && (
          <LocationTable
            data={data}
            label={'Gaps'}
            metrics={metrics}
            demographics={gaps}
            activeMetric={metric}
            activeDemographic={demographic}
            onMetricSelect={handleMetricSelect}
            onDemographicSelect={handleDemographicSelect}
          />
        )}
      </SidePanelBody>
    </SidePanel>
  ) : null
}

export default SedaLocationPanel