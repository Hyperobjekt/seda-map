import React from 'react'
import { IconButton, List, withStyles } from '@material-ui/core'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter
} from '../../../../shared'
import { getRegionFromLocationId } from '../../app/selectors'
import { CloseIcon } from '../../../icons'
import { useMetric } from '../../app/hooks'
import { SedaLocationName } from '..'
import useActiveLocationData from '../hooks/useActiveLocationData'
import useActiveLocation from '../hooks/useActiveLocation'

import { getLang, getPrefixLang } from '../../app/selectors/lang'
import { CompareButton } from '../../compare'
import DownloadReportButton from './DownloadReportButton'
import SedaLocationKeyMetrics from './SedaLocationKeyMetrics'
import SedaLocationSummary from './SedaLocationSummary'
import SedaDemographicList from './SedaDemographicList'
import {
  getDemographicsForRegion,
  getGapsForRegion
} from '../../app/selectors/demographics'
import SedaLocationFlags from './SedaLocationFlags'

const styles = theme => ({
  list: {
    '& .MuiListSubheader-root': {
      paddingLeft: theme.spacing(3)
    }
  },
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

// determines which subgroup should have a divider below it
const SUBGROUP_BREAKS = ['all', 'a', 'f']

const SedaLocationPanel = ({ classes, ...props }) => {
  const data = useActiveLocationData()
  const [, setActiveLocation] = useActiveLocation()
  const [metric] = useMetric()
  const region = data ? getRegionFromLocationId(data.id) : null

  // groups of subgroups for full readout
  const subgroups = getDemographicsForRegion(region)
  const gaps = getGapsForRegion(region)

  const subgroupTitle = getLang('LOCATION_SUBHEADING_SUBGROUP', {
    metric: getPrefixLang(metric, 'LABEL')
  })

  const gapTitle = getLang('LOCATION_SUBHEADING_GAPS', {
    metric: getPrefixLang(metric, 'LABEL')
  })

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
          <List className={classes.list} disablePadding>
            <SedaLocationFlags locationId={data.id} />
            <SedaLocationSummary location={data} />
            <SedaLocationKeyMetrics location={data} />
            {region !== 'schools' && (
              <SedaDemographicList
                title={subgroupTitle}
                metric={metric}
                subgroups={subgroups}
                location={data}
                breaks={SUBGROUP_BREAKS}
              />
            )}
            {region !== 'schools' && (
              <SedaDemographicList
                title={gapTitle}
                metric={metric}
                subgroups={gaps}
                location={data}
              />
            )}
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
