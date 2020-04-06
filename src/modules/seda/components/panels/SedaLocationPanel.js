import React from 'react'
import { IconButton } from '@material-ui/core'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../base/components/Panels/SidePanel'
import { LocationTable } from '../base'
import { getStateName } from '../../../../shared/selectors/states'
import {
  getSelectedColors,
  getDemographics,
  getGaps
} from '../../../../shared/selectors'
import LocationName from '../base/LocationName'
import { CloseIcon } from '../../../icons'
import {
  useActiveLocationData,
  useMetric,
  useDemographic,
  useActiveLocation
} from '../../hooks'

const colors = getSelectedColors()

const SedaLocationPanel = props => {
  const data = useActiveLocationData()
  const [, setActiveLocation] = useActiveLocation()
  const [metric, setMetric] = useMetric()
  const [demographic, setDemographic] = useDemographic()

  const metrics = ['avg', 'grd', 'coh']
  const demographics = getDemographics().map(d => d.id)
  const gaps = getGaps().map(d => d.id)

  const handleMetricSelect = e => {
    setMetric(e.currentTarget.value)
  }
  const handleDemographicSelect = e => {
    setDemographic(e.currentTarget.value)
  }
  return (
    <SidePanel {...props}>
      <SidePanelHeader sticky>
        {data['id'] && (
          <LocationName
            name={data['name']}
            parentLocation={getStateName(data['id'])}
            label={data['index'] + 1}
            color={colors[data['index']]}
          />
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
      </SidePanelBody>
    </SidePanel>
  )
}

export default SedaLocationPanel
