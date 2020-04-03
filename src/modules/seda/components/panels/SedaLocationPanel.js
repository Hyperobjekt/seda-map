import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, IconButton } from '@material-ui/core'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../base/components/Panels/SidePanel'
import useDataOptions from '../../hooks/useDataOptions'
import LocationTable from './LocationPanel/LocationTable'
import { getStateName } from '../../../../shared/selectors/states'
import {
  getSelectedColors,
  getDemographics,
  getGaps
} from '../../../../shared/selectors'
import LocationName from '../base/LocationName'
import { CloseIcon } from '../../../icons'

const colors = getSelectedColors()

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.typography.panelHeading
}))

const SedaLocationPanel = props => {
  const classes = useStyles()
  const getActiveLocation = useDataOptions(
    state => state.getActiveLocation
  )
  const data = getActiveLocation()
  const setActiveLocation = useDataOptions(
    state => state.setActiveLocation
  )
  const metrics = ['avg', 'grd', 'coh']
  const metricId = useDataOptions(state => state.metric.id)
  const demId = useDataOptions(state => state.demographic.id)
  const demographics = getDemographics().map(d => d.id)
  const gaps = getGaps().map(d => d.id)
  const setMetric = useDataOptions(state => state.setMetric)
  const setDemographic = useDataOptions(
    state => state.setDemographic
  )

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
          activeMetric={metricId}
          activeDemographic={demId}
          labelPrefix="LABEL_STUDENTS"
          onMetricSelect={handleMetricSelect}
          onDemographicSelect={handleDemographicSelect}
        />
        <LocationTable
          data={data}
          label={'Gaps'}
          metrics={metrics}
          demographics={gaps}
          activeMetric={metricId}
          activeDemographic={demId}
          onMetricSelect={handleMetricSelect}
          onDemographicSelect={handleDemographicSelect}
        />
      </SidePanelBody>
    </SidePanel>
  )
}

SedaLocationPanel.propTypes = {}

export default SedaLocationPanel
