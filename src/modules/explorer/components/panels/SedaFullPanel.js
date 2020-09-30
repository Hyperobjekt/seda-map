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
import SedaSelectionButton from '../controls/SedaSelectionButton'
import {
  getLang,
  getLangWithSingleOrNone,
  getMetricLabel,
  getRegionLabel,
  getPrefixLang
} from '../../selectors/lang'
import PreviewChartPanel from './SedaPreviewChartPanel'
import { SidebarCloseIcon } from '../../../icons'
import {
  useCondensed,
  useActiveSelection,
  useLocationCount,
  useChartVisible,
  useActiveView,
  useActiveOptionIds
} from '../../hooks'

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

const SedaFullPanel = props => {
  const classes = useStyles()
  const [view] = useActiveView()
  const [condensed, toggleCondensed] = useCondensed()
  const [metricId, demId, regionId] = useActiveOptionIds()
  const [selection] = useActiveSelection()
  const [showChart] = useChartVisible()
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
        <SedaSelectionButton
          active={selection === 'metric'}
          selectionId="metric"
          value={getMetricLabel(metricId)}
        />
        <SedaSelectionButton
          active={selection === 'region'}
          selectionId="region"
          value={getRegionLabel(regionId)}
        />
        <SedaSelectionButton
          active={selection === 'demographic'}
          selectionId="demographic"
          value={getPrefixLang(demId, 'LABEL_STUDENTS')}
        />
        <SedaSelectionButton
          active={selection === 'filter'}
          selectionId="filter"
          value="ACTIVE_FILTERS"
        />
        <SedaSelectionButton
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
        <PreviewChartPanel
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
