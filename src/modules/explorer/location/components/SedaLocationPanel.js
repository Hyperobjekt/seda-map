import React from 'react'
import {
  IconButton,
  List,
  ListSubheader,
  withStyles
} from '@material-ui/core'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../shared'
import {
  getDemographics,
  getGaps,
  getMetricIdFromVarName,
  getRegionFromLocationId
} from '../../app/selectors'
import { CloseIcon } from '../../../icons'
import {
  useMetric,
  useDemographic,
  useAppContext
} from '../../app/hooks'
import { SedaLocationName } from '..'
import useActiveLocationData from '../hooks/useActiveLocationData'
import useActiveLocation from '../hooks/useActiveLocation'
import LocationTable from './LocationTable'
import SedaKeyMetricListItem from './SedaKeyMetricListItem'
import SedaLocationStatsList from './SedaLocationStatsList'
import SedaDemographicListItem from './SedaDemographicListItem'

const styles = theme => ({
  root: {},
  header: {
    minHeight: theme.spacing(8)
  }
})

// /**
//  * Gets the secondary metrics for the region
//  * @param {*} region
//  */
// const getSecondaryMetricsForRegion = region => {
//   return region === 'schools' ? ['frl'] : ['ses', 'seg', 'min']
// }

/**
 * Gets available gaps for region
 * @param {*} region
 */
const getGapsForRegion = region => {
  return region === 'schools' ? [] : getGaps().map(d => d.id)
}

const SedaLocationPanel = ({ classes, ...props }) => {
  const data = useActiveLocationData()
  const [activeLocation, setActiveLocation] = useActiveLocation()
  const [metric, setMetric] = useMetric()
  const [demographic, setDemographic] = useDemographic()
  const region = getRegionFromLocationId(activeLocation)

  console.log(data)

  const varNames = ['all_avg', 'all_grd', 'all_coh']
  // groups of subgroups for full readout

  const groups = [
    ['all'],
    ['a', 'b', 'h', 'i', 'w'],
    ['np', 'p'],
    ['m', 'f']
  ]
  const gaps = ['wb', 'wh', 'wi', 'pn', 'mf']

  const handleMetricSelect = varName => {
    const metric = getMetricIdFromVarName(varName)
    setMetric(metric)
  }

  const handleDemographicSelect = dem => {
    setDemographic(dem)
  }

  // TODO: better handling when data isn't ready yet
  return data ? (
    <SidePanel {...props}>
      <SidePanelHeader sticky className={classes.header}>
        {data['id'] && (
          <SedaLocationName locationId={data['id']} />
        )}
        <IconButton onClick={() => setActiveLocation(null)}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody>
        <List>
          <ListSubheader>
            Average For All Subgroups
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
          <ListSubheader>Average By Subgroup</ListSubheader>
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
                onClick={() => handleDemographicSelect(subgroup)}
              />
            )
          })}
          <ListSubheader>
            Difference Between Subgroups
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
                onClick={() => handleDemographicSelect(subgroup)}
              />
            )
          })}
        </List>
      </SidePanelBody>
    </SidePanel>
  ) : null
}

export default withStyles(styles)(SedaLocationPanel)
