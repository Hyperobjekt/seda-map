import React from 'react'
import { Box, List, Typography } from '@material-ui/core'
import { useAppContext } from '../../app/hooks'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import SedaFilterFlags from './SedaFilterFlags'
import SedaMetricSlider from './SedaMetricSlider'
import SedaClearFilterButton from './SedaClearFilterButton'
import SedaFilterLocation from './SedaFilterLocation'
// import SedaLimitSlider from './SedaLimitSlider'
import SedaLimitButtons from './SedaLimitButtons'
import { formatInteger } from '../../../../shared/utils'
import SedaAreaClassification from './SedaAreaClassification'
import SedaSchoolType from './SedaSchoolType'
import SedaAgeGroup from './SedaAgeGroup'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import SedaMetricMenu from './SedaMetricFilterMenu'
import { Add } from '@material-ui/icons'

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

  const [filterMetrics, setFilterMetrics] = React.useState([])
  const menuMetrics = metrics.filter(
    m => filterMetrics.indexOf(m) === -1
  )

  const handleAddMetric = metric => {
    setFilterMetrics(filterMetrics.concat(metric))
  }

  const handleRemoveMetric = metric => {
    setFilterMetrics(filterMetrics.filter(m => m !== metric))
  }

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
      {region !== 'states' && <SedaFilterLocation />}
      <PanelListItem
        title={getPrefixLang('size', 'FILTER_LABEL')}
        desc={getPrefixLang('size_desc', 'FILTER_LABEL')}>
        <SedaLimitButtons />
      </PanelListItem>
      <PanelListItem title={getLang('FLAG_LABEL_AREA')}>
        <SedaAreaClassification />
      </PanelListItem>
      <PanelListItem title={getLang('FLAG_LABEL_SCHOOL')}>
        <SedaSchoolType />
      </PanelListItem>
      <PanelListItem title={getLang('FLAG_LABEL_AGE')}>
        <SedaAgeGroup />
      </PanelListItem>
      <PanelListItem title="Filter by Metric">
        {filterMetrics.length === 0 && (
          <Box clone pt={1} pb={1} color="text.secondary">
            <Typography variant="body1">
              No metrics currently selected
            </Typography>
          </Box>
        )}
        {filterMetrics.map(metric => (
          <SedaMetricSlider
            key={metric}
            metricId={metric}
            isActive={metric === activeMetric}
            onDismiss={handleRemoveMetric}
          />
        ))}
        <SedaMetricMenu
          metrics={menuMetrics}
          onSelect={handleAddMetric}>
          <Add
            style={{
              fontSize: 16,
              marginRight: 8,
              marginTop: -2
            }}
          />{' '}
          Add a metric filter
        </SedaMetricMenu>
      </PanelListItem>
    </List>
  )
}

export default SedaFiltersForm
