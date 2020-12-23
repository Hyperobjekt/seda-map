import React from 'react'
import { List } from '@material-ui/core'
import { useRegion } from '../../app/hooks'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import SedaFilterFlags from './SedaFilterFlags'
import SedaMetricSlider from './SedaMetricSlider'
import SedaClearFilterButton from './SedaClearFilterButton'
import SedaFilterLocation from './SedaFilterLocation'
import SedaLimitSlider from './SedaLimitSlider'

/**
 * Contains all controls for modifying filters
 */
const SedaFiltersForm = props => {
  // get active demographic
  const [region] = useRegion()

  // get ranges from filter array
  const metrics = [
    'avg',
    'grd',
    'coh',
    region === 'schools' ? 'frl' : 'ses'
  ]

  return (
    <List {...props}>
      <PanelListItem>
        <SedaClearFilterButton />
      </PanelListItem>
      {region !== 'states' && <SedaFilterLocation />}
      <SedaLimitSlider />
      {metrics.map(metric => (
        <SedaMetricSlider key={metric} metricId={metric} />
      ))}
      {(region === 'schools' || region === 'districts') && (
        <SedaFilterFlags />
      )}
    </List>
  )
}

export default SedaFiltersForm
