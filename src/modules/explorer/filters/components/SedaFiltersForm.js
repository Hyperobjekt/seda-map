import React from 'react'
import { List, Typography } from '@material-ui/core'
import { useAppContext } from '../../app/hooks'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import SedaFilterFlags from './SedaFilterFlags'
import SedaMetricSlider from './SedaMetricSlider'
import SedaClearFilterButton from './SedaClearFilterButton'
import SedaFilterLocation from './SedaFilterLocation'
// import SedaLimitSlider from './SedaLimitSlider'
import SedaLimitButtons from './SedaLimitButtons'
import { formatInteger } from '../../../../shared/utils'

/**
 * Contains all controls for modifying filters
 */
const SedaFiltersForm = props => {
  const {
    filterResults,
    totalResults,
    region,
    metric: activeMetric
  } = useAppContext()

  // TODO: only show metric sliders that are added
  // const [filterMetrics, setFilterMetrics] = useState([])

  const isFiltered = filterResults !== totalResults

  const metrics = [
    'avg',
    'grd',
    'coh',
    region === 'schools' ? 'frl' : 'ses'
  ]

  return (
    <List {...props}>
      <PanelListItem>
        {isFiltered ? (
          <Typography variant="body1">
            Showing {formatInteger(filterResults)} of{' '}
            {formatInteger(totalResults)} {region}
          </Typography>
        ) : (
          <Typography variant="body1">
            Showing all {formatInteger(totalResults)} {region}
          </Typography>
        )}
      </PanelListItem>
      <PanelListItem>
        <SedaClearFilterButton />
      </PanelListItem>
      {region !== 'states' && <SedaFilterLocation />}
      <SedaLimitButtons />
      {metrics.map(metric => (
        <SedaMetricSlider
          key={metric}
          metricId={metric}
          isActive={metric === activeMetric}
        />
      ))}
      <SedaFilterFlags />
    </List>
  )
}

export default SedaFiltersForm
