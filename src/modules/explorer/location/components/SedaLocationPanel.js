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
  getMetricIdFromVarName,
  getRegionFromLocationId
} from '../../app/selectors'
import { CloseIcon } from '../../../icons'
import { useMetric, useDemographic } from '../../app/hooks'
import { SedaLocationName } from '..'
import useActiveLocationData from '../hooks/useActiveLocationData'
import useActiveLocation from '../hooks/useActiveLocation'
import SedaKeyMetricListItem from './SedaKeyMetricListItem'
import SedaDemographicListItem from './SedaDemographicListItem'
import { getLang, getPrefixLang } from '../../app/selectors/lang'

const styles = theme => ({
  root: {},
  header: {
    minHeight: theme.spacing(8)
  }
})

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
      <SidePanelBody>
        {data && (
          <List>
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
    </SidePanel>
  )
}

export default withStyles(styles)(SedaLocationPanel)
