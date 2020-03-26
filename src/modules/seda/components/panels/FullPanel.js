import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  makeStyles,
  Button,
  IconButton,
  useTheme,
  Tooltip
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter
} from '../../../../base/components/Panels'
import useUiStore from '../../hooks/useUiStore'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import MenuOpen from '@material-ui/icons/MenuOpen'
import SedaSelectionButton from '../controls/SedaSelectionButton'
import {
  getLang,
  getLangWithSingleOrNone
} from '../../../../shared/selectors/lang'
import PreviewChartPanel from './PreviewChartPanel'
import { getFilterCount } from '../../../../shared/selectors/data'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.typography.panelHeading,
  details: { padding: 0 },
  body: {
    padding: '4px 0'
  },
  footerPanel: {
    transition: 'transform 0.4s ease-in-out 0.2s',
    transformOrigin: 'left bottom'
  },
  footerCondensed: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    transform: `translate(calc(100% + ${theme.app
      .condensedPanelWidth + theme.spacing(3)}px), -24px)`
  },
  footerCondensedHide: {
    transform: 'scale(0.0001)'
  }
}))

const FullPanel = props => {
  const classes = useStyles()
  const view = useUiStore(state => state.view)
  const condensed = useUiStore(state => state.condensed)
  const toggleCondensed = useUiStore(
    state => state.toggleCondensed
  )
  const locations = useDataOptions(state => state.locations)
  const metric = useDataOptions(state => state.metric)
  const region = useDataOptions(state => state.region)
  const filters = useDataOptions(state => state.filters)
  const selection = useUiStore(state => state.selection)
  const demographic = useDataOptions(state => state.demographic)
  const showChart = useUiStore(state => state.showChart)
  const getActiveFiltersLang = useDataOptions(
    state => state.getActiveFiltersLang
  )
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
            <MenuOpen />
          </IconButton>
        </Tooltip>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <SedaSelectionButton
          active={selection === 'metric'}
          selectionId="metric"
          value={metric.label}
        />
        <SedaSelectionButton
          active={selection === 'region'}
          selectionId="region"
          value={region.label}
        />
        <SedaSelectionButton
          active={selection === 'demographic'}
          selectionId="demographic"
          value={getLang('LABEL_STUDENTS_' + demographic.id)}
        />
        <SedaSelectionButton
          active={selection === 'filter'}
          selectionId="filter"
          value={getActiveFiltersLang()}
        />
        <SedaSelectionButton
          active={selection === 'location'}
          selectionId="location"
          value={getLangWithSingleOrNone(
            locations.length,
            'PANEL_LOCATION'
          )}
        />
      </SidePanelBody>
      {view === 'map' && (
        <SidePanelFooter sticky>
          <PreviewChartPanel
            className={clsx(classes.footerPanel, {
              [classes.footerCondensed]:
                condensed && showChart && view === 'map',
              [classes.footerCondensedHide]:
                condensed && !showChart && view === 'map'
            })}
          />
        </SidePanelFooter>
      )}
    </SidePanel>
  )
}

FullPanel.propTypes = {}

export default FullPanel
