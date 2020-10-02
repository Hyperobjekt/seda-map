import React from 'react'
import {
  Typography,
  makeStyles,
  IconButton,
  Tooltip
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter
} from '../../../../shared'
import clsx from 'clsx'
import SedaPanelButton from './SedaPanelButton'
import {
  getLang,
  getLangWithSingleOrNone,
  getMetricLabel,
  getRegionLabel,
  getPrefixLang
} from '../../app/selectors/lang'
import { SidebarCloseIcon } from '../../../icons'
import { useActiveView, useActiveOptions } from '../../app/hooks'
import { useLocationCount } from '../../location'
import SedaPreviewChartPanel from './SedaPreviewChartPanel'
import useCondensedPanel from '../hooks/useCondensedPanel'
import useActivePanel from '../hooks/useActivePanel'
import usePanelChartVisible from '../hooks/usePanelChartVisible'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.mixins.boldType,
  details: { padding: 0 },
  body: {
    padding: '4px 0'
  },
  footerPanel: {
    transition: 'transform 0.3s ease-in-out',
    transformOrigin: 'left bottom'
  },
  footerCondensed: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    transform: `translate(calc(100% + ${theme.app
      .condensedPanelWidth + theme.spacing(6)}px), -24px)`
  },
  footerCondensedHide: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    transform: `translate(calc(100% + ${theme.app
      .condensedPanelWidth + theme.spacing(6)}px), 100%)`
  }
}))

/**
 * Expanded version of the control panel
 */
const SedaFullPanel = props => {
  const classes = useStyles()
  const [view] = useActiveView()
  const [condensed, toggleCondensed] = useCondensedPanel()
  const [metricId, demId, regionId] = useActiveOptions()
  const [selection] = useActivePanel()
  const [showChart] = usePanelChartVisible()
  const locationCount = useLocationCount()
  // const filterLabel = useActiveFilterLang()
  return (
    <SidePanel {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          Data Options
        </Typography>
        <Tooltip
          arrow
          title={getLang('TOOLTIP_HINT_HIDE')}
          placement="right">
          <IconButton onClick={toggleCondensed}>
            <SidebarCloseIcon />
          </IconButton>
        </Tooltip>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <SedaPanelButton
          active={selection === 'metric'}
          selectionId="metric"
          value={getMetricLabel(metricId)}
        />
        <SedaPanelButton
          active={selection === 'region'}
          selectionId="region"
          value={getRegionLabel(regionId)}
        />
        <SedaPanelButton
          active={selection === 'demographic'}
          selectionId="demographic"
          value={getPrefixLang(demId, 'LABEL_STUDENTS')}
        />
        <SedaPanelButton
          active={selection === 'filter'}
          selectionId="filter"
          value="ACTIVE_FILTERS"
        />
        <SedaPanelButton
          active={selection === 'location'}
          selectionId="location"
          value={getLangWithSingleOrNone(
            locationCount,
            'PANEL_LOCATION'
          )}
        />
      </SidePanelBody>
      <SidePanelFooter
        sticky
        style={{
          transition: `height 0.2s ease-in-out`,
          height: view === 'map' ? (showChart ? 264 : 48) : 0
        }}>
        <SedaPreviewChartPanel
          className={clsx(classes.footerPanel, {
            [classes.footerCondensed]:
              condensed && showChart && view === 'map',
            [classes.footerCondensedHide]:
              condensed && !showChart && view === 'map'
          })}
        />
      </SidePanelFooter>
    </SidePanel>
  )
}

export default SedaFullPanel
