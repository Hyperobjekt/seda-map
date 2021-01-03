import React from 'react'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
  withStyles
} from '@material-ui/core'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter
} from '../../../../shared'
import {
  getMetricIdFromVarName,
  getRegionFromLocationId,
  valueToLowMidHigh
} from '../../app/selectors'
import { CloseIcon } from '../../../icons'
import { useMetric, useDemographic } from '../../app/hooks'
import { SedaLocationName } from '..'
import useActiveLocationData from '../hooks/useActiveLocationData'
import useActiveLocation from '../hooks/useActiveLocation'
import SedaKeyMetricListItem from './SedaKeyMetricListItem'
import SedaDemographicListItem from './SedaDemographicListItem'
import {
  getDescriptionForVarName,
  getLang,
  getPrefixLang
} from '../../app/selectors/lang'
import { CompareButton } from '../../compare'
import DownloadReportButton from './DownloadReportButton'
import {
  getMetricIdsForRegion,
  getMetricsForRegion
} from '../../app/selectors/metrics'
import LocationSummaryListItem from './LocationSummaryListItem'

const styles = theme => ({
  root: {},
  header: {
    minHeight: theme.spacing(8)
  },
  footer: {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    height: theme.spacing(6),
    '& .MuiButton-root': {
      flex: 1,
      '&:first-child': {
        borderRight: '1px solid',
        borderRightColor: theme.palette.divider
      }
    }
  }
})

const getSummaryItem = (location, metricId, demId = 'all') => {
  const varName = [demId, metricId].join('_')
  if (!location || !location[varName]) return null
  const quantifier = valueToLowMidHigh(
    metricId,
    location[varName]
  )
  const description = getLang(
    ['SUMMARY', metricId, quantifier].join('_')
  )
  return {
    metricId,
    quantifier,
    description
  }
}

const getSummaryItems = location => {
  if (!location) return []
  const region = getRegionFromLocationId(location.id)
  const metrics = getMetricIdsForRegion(region)
  return metrics
    .map(m => getSummaryItem(location, m))
    .filter(v => !!v)
}

const SedaLocationPanel = ({ classes, ...props }) => {
  const data = useActiveLocationData()
  const [activeLocation, setActiveLocation] = useActiveLocation()
  const [metric, setMetric] = useMetric()
  const [demographic, setDemographic] = useDemographic()
  const region = getRegionFromLocationId(activeLocation)

  const varNames = ['all_avg', 'all_grd', 'all_coh']
  // groups of subgroups for full readout

  const groups = [
    ['all'],
    ['a', 'b', 'h', 'i', 'w'],
    ['np', 'p'],
    ['m', 'f']
  ]
  const gaps = ['wb', 'wh', 'wi', 'pn', 'mf']

  const summaryItems = getSummaryItems(data)

  const handleMetricSelect = varName => {
    const metric = getMetricIdFromVarName(varName)
    setMetric(metric)
  }

  const handleDemographicSelect = dem => {
    setDemographic(dem)
  }

  // TODO: better handling when data isn't ready yet
  return (
    <SidePanel {...props}>
      <SidePanelHeader sticky className={classes.header}>
        {data && data['id'] && (
          <SedaLocationName locationId={data['id']} />
        )}
        <IconButton onClick={() => setActiveLocation(null)}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody style={{ overflowY: 'scroll' }}>
        {data && (
          <List disablePadding>
            <ListSubheader>
              {getLang('LOCATION_SUBHEADING_SUMMARY')}
            </ListSubheader>
            {summaryItems.map((summary, i) => (
              <LocationSummaryListItem
                key={summary.metricId}
                indicator={summary.quantifier}
                description={summary.description}
              />
            ))}
            <ListSubheader>
              {getLang('LOCATION_SUBHEADING_OVERALL')}
            </ListSubheader>
            {varNames.map(varName => (
              <SedaKeyMetricListItem
                key={varName}
                varName={varName}
                value={data[varName]}
                interval={data[varName + '_e']}
                selected={
                  getMetricIdFromVarName(varName) === metric
                }
                button
                onClick={() => handleMetricSelect(varName)}
              />
            ))}
            <ListSubheader>
              {getLang('LOCATION_SUBHEADING_SUBGROUP', {
                metric: getPrefixLang(metric, 'LABEL')
              })}
            </ListSubheader>
            {groups.flat().map(subgroup => {
              const varName = subgroup + '_' + metric
              return (
                <SedaDemographicListItem
                  key={subgroup}
                  varName={varName}
                  value={data[varName]}
                  interval={data[varName + '_e']}
                  selected={subgroup === demographic}
                  button
                  onClick={() =>
                    handleDemographicSelect(subgroup)
                  }
                />
              )
            })}
            <ListSubheader>
              {getLang('LOCATION_SUBHEADING_GAPS', {
                metric: getPrefixLang(metric, 'LABEL')
              })}
            </ListSubheader>
            {gaps.map(subgroup => {
              const varName = subgroup + '_' + metric
              return (
                <SedaDemographicListItem
                  key={subgroup}
                  varName={varName}
                  value={data[varName]}
                  interval={data[varName + '_e']}
                  selected={subgroup === demographic}
                  button
                  onClick={() =>
                    handleDemographicSelect(subgroup)
                  }
                />
              )
            })}
          </List>
        )}
      </SidePanelBody>
      <SidePanelFooter className={classes.footer}>
        <CompareButton />
        <DownloadReportButton location={data} />
      </SidePanelFooter>
    </SidePanel>
  )
}

export default withStyles(styles)(SedaLocationPanel)
